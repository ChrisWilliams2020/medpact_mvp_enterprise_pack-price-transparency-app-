"""
OIDC / Auth0 Authentication Module

Supports two modes:
1. Development: Uses X-Practice-Id header (no authentication)
2. Production: Uses Auth0 with JWT validation

Environment Variables:
- AUTH_ENABLED: Set to "true" to enable OIDC (defaults to "false" for dev)
- AUTH0_DOMAIN: Auth0 domain (e.g., "yourapp.auth0.com")
- AUTH0_CLIENT_ID: Auth0 application client ID
- AUTH0_CLIENT_SECRET: Auth0 application client secret
- AUTH0_AUDIENCE: API identifier/audience
- AUTH0_CALLBACK_URL: Callback URL after login (default: http://localhost:8000/auth/callback)
- AUTH_COOKIE_SECRET: Secret for signing session cookies
"""

import os
from typing import Optional
from functools import lru_cache

from fastapi import APIRouter, Request, Depends, HTTPException, Header
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Optional imports - gracefully degrade if not installed
try:
    from authlib.integrations.starlette_client import OAuth
    HAS_AUTHLIB = True
except ImportError:
    OAuth = None  # type: ignore
    HAS_AUTHLIB = False

try:
    from jose import jwt, JWTError
    import httpx
    HAS_JOSE = True
except ImportError:
    jwt = None  # type: ignore
    JWTError = Exception  # type: ignore
    HAS_JOSE = False

router = APIRouter(prefix="/auth", tags=["auth"])

# Security scheme for OpenAPI docs
security = HTTPBearer(auto_error=False)

# Configuration
AUTH_ENABLED = os.getenv("AUTH_ENABLED", "false").lower() == "true"
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET", "")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "")
AUTH0_CALLBACK_URL = os.getenv("AUTH0_CALLBACK_URL", "http://localhost:8000/auth/callback")
AUTH_COOKIE_SECRET = os.getenv("AUTH_COOKIE_SECRET", "dev-secret-change-in-production")
AUTH_COOKIE_NAME = "mp_session"


class UserInfo(BaseModel):
    """User information extracted from JWT token."""
    sub: str  # Auth0 user ID
    email: Optional[str] = None
    name: Optional[str] = None
    practice_id: Optional[str] = None  # Custom claim for practice association


class AuthConfig(BaseModel):
    """Auth configuration response."""
    enabled: bool
    provider: str
    login_url: Optional[str] = None


# ============================================================================
# JWKS Handling for JWT validation
# ============================================================================

@lru_cache(maxsize=1)
def get_jwks():
    """Fetch and cache JWKS from Auth0."""
    if not AUTH0_DOMAIN or not HAS_JOSE:
        return {}
    try:
        import httpx
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        response = httpx.get(jwks_url, timeout=10.0)
        response.raise_for_status()
        return response.json()
    except Exception:
        return {}


def get_rsa_key(token: str) -> Optional[dict]:
    """Get the RSA public key from JWKS matching the token's kid."""
    try:
        unverified_header = jwt.get_unverified_header(token)
    except Exception:
        return None
    
    jwks = get_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == unverified_header.get("kid"):
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    return None


# ============================================================================
# OAuth Client Setup
# ============================================================================

def get_oauth_client():
    """Create OAuth client for Auth0."""
    if not HAS_AUTHLIB:
        return None
    if not AUTH0_DOMAIN or not AUTH0_CLIENT_ID:
        return None
    
    oauth = OAuth()
    oauth.register(
        name="auth0",
        client_id=AUTH0_CLIENT_ID,
        client_secret=AUTH0_CLIENT_SECRET,
        server_metadata_url=f"https://{AUTH0_DOMAIN}/.well-known/openid-configuration",
        client_kwargs={"scope": "openid profile email"},
    )
    return oauth


# ============================================================================
# Auth Endpoints
# ============================================================================

@router.get("/config")
async def get_auth_config() -> AuthConfig:
    """Return authentication configuration for the frontend."""
    return AuthConfig(
        enabled=AUTH_ENABLED,
        provider="auth0" if AUTH0_DOMAIN else "none",
        login_url="/auth/login" if AUTH_ENABLED else None,
    )


@router.get("/login")
async def login(request: Request):
    """Initiate OIDC login flow with Auth0."""
    if not AUTH_ENABLED:
        raise HTTPException(status_code=400, detail="Authentication not enabled")
    
    oauth = get_oauth_client()
    if oauth is None:
        raise HTTPException(
            status_code=501, 
            detail="OIDC not configured. Install authlib and set AUTH0_DOMAIN/CLIENT_ID."
        )
    
    return await oauth.auth0.authorize_redirect(request, AUTH0_CALLBACK_URL)


@router.get("/callback")
async def callback(request: Request):
    """Handle Auth0 callback after successful authentication."""
    if not AUTH_ENABLED:
        raise HTTPException(status_code=400, detail="Authentication not enabled")
    
    oauth = get_oauth_client()
    if oauth is None:
        raise HTTPException(status_code=501, detail="OIDC not configured")
    
    try:
        token = await oauth.auth0.authorize_access_token(request)
        userinfo = token.get("userinfo") or await oauth.auth0.userinfo(token=token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {e}")
    
    if not userinfo:
        raise HTTPException(status_code=401, detail="Failed to get user info")
    
    # Create session cookie with user info
    if HAS_JOSE:
        session_data = {
            "sub": userinfo.get("sub"),
            "email": userinfo.get("email"),
            "name": userinfo.get("name"),
        }
        signed_cookie = jwt.encode(session_data, AUTH_COOKIE_SECRET, algorithm="HS256")
        response = RedirectResponse(url="/")
        response.set_cookie(
            AUTH_COOKIE_NAME, 
            signed_cookie, 
            httponly=True, 
            secure=os.getenv("ENV", "development") == "production",
            samesite="lax",
            max_age=86400 * 7,  # 7 days
        )
        return response
    
    # Fallback: return user info as JSON
    return {"user": userinfo}


@router.get("/logout")
async def logout(request: Request):
    """Clear session and redirect to Auth0 logout."""
    response = RedirectResponse(url="/")
    response.delete_cookie(AUTH_COOKIE_NAME)
    
    if AUTH0_DOMAIN:
        # Redirect to Auth0 logout endpoint
        logout_url = f"https://{AUTH0_DOMAIN}/v2/logout?client_id={AUTH0_CLIENT_ID}&returnTo={request.base_url}"
        response = RedirectResponse(url=logout_url)
        response.delete_cookie(AUTH_COOKIE_NAME)
    
    return response


@router.get("/me")
async def get_current_user_info(request: Request):
    """Get current user info from session cookie."""
    user = get_user_from_cookie(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


# ============================================================================
# Authentication Dependencies
# ============================================================================

def get_user_from_cookie(request: Request) -> Optional[dict]:
    """Extract user info from session cookie."""
    cookie = request.cookies.get(AUTH_COOKIE_NAME)
    if not cookie or not HAS_JOSE:
        return None
    try:
        return jwt.decode(cookie, AUTH_COOKIE_SECRET, algorithms=["HS256"])
    except Exception:
        return None


def validate_jwt_token(token: str) -> Optional[dict]:
    """Validate a JWT token from Auth0."""
    if not HAS_JOSE or not AUTH0_DOMAIN:
        return None
    
    rsa_key = get_rsa_key(token)
    if not rsa_key:
        return None
    
    try:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/",
        )
        return payload
    except JWTError:
        return None


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    x_practice_id: Optional[str] = Header(None, alias="X-Practice-Id"),
) -> UserInfo:
    """
    Get current authenticated user.
    
    Authentication methods (in priority order):
    1. Bearer token in Authorization header (JWT from Auth0)
    2. Session cookie (from OIDC login flow)
    3. X-Practice-Id header (development mode only)
    
    Returns UserInfo with practice_id extracted from:
    - Custom claim in JWT (practice_id or https://medpact.ai/practice_id)
    - X-Practice-Id header as fallback
    """
    # If auth is disabled, use dev mode with X-Practice-Id header
    if not AUTH_ENABLED:
        practice_id = x_practice_id or "default-practice"
        return UserInfo(
            sub=f"dev-user-{practice_id}",
            practice_id=practice_id,
        )
    
    # Try Bearer token first
    if credentials and credentials.credentials:
        payload = validate_jwt_token(credentials.credentials)
        if payload:
            return UserInfo(
                sub=payload.get("sub", ""),
                email=payload.get("email"),
                name=payload.get("name"),
                practice_id=payload.get("practice_id") or payload.get("https://medpact.ai/practice_id"),
            )
    
    # Try session cookie
    user_data = get_user_from_cookie(request)
    if user_data:
        return UserInfo(
            sub=user_data.get("sub", ""),
            email=user_data.get("email"),
            name=user_data.get("name"),
            practice_id=user_data.get("practice_id") or x_practice_id,
        )
    
    raise HTTPException(status_code=401, detail="Not authenticated")


def get_practice_id(
    x_practice_id: Optional[str] = Header(None, alias="X-Practice-Id"),
) -> str:
    """
    Get practice ID from header.
    
    This is a simpler dependency for endpoints that only need practice_id.
    In production, this should validate that the user has access to this practice.
    """
    if not x_practice_id:
        raise HTTPException(status_code=400, detail="X-Practice-Id header required")
    return x_practice_id


# ============================================================================
# Utility function for checking auth status
# ============================================================================

def is_auth_configured() -> bool:
    """Check if authentication is properly configured."""
    return AUTH_ENABLED and bool(AUTH0_DOMAIN) and bool(AUTH0_CLIENT_ID)
