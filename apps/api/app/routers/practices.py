"""
Practice registration and management endpoints
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from passlib.hash import bcrypt
import uuid
import hashlib
import secrets

from app.db import get_db
from app.core.audit import audit_logger, AuditAction

router = APIRouter()

# In-memory storage (replace with database in production)
practices_db = {}
users_db = {}

class PracticeRegistration(BaseModel):
    # Practice Info
    practiceName: str
    practiceType: str
    npi: str
    taxId: str
    
    # Address
    address: str
    city: str
    state: str
    zip: str
    phone: str
    
    # Admin User
    adminFirstName: str
    adminLastName: str
    adminEmail: EmailStr
    adminPassword: str
    
    # Billing
    billingPlan: str
    
    # Agreements
    acceptTerms: bool
    acceptBAA: bool


class RegistrationResponse(BaseModel):
    success: bool
    practice_id: str
    user_id: str
    access_token: str
    message: str


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

@router.post("/register", response_model=RegistrationResponse)
async def register_practice(data: PracticeRegistration):
    """
    Register a new practice and create admin user
    """
    # Validate agreements
    if not data.acceptTerms or not data.acceptBAA:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must accept the Terms of Service and BAA"
        )
    
    # Validate NPI
    if len(data.npi) != 10 or not data.npi.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid NPI format"
        )
    
    # Check if email already exists
    if data.adminEmail in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if NPI already exists
    for practice in practices_db.values():
        if practice["npi"] == data.npi:
            raise HTTPException(status_code=400, detail="NPI already registered")
    
    # Generate IDs
    practice_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())
    
    # Hash password
    password_hash = bcrypt.hash(data.adminPassword)
    
    # Create practice record
    practice = {
        "id": practice_id,
        "practice_name": data.practiceName,
        "practice_type": data.practiceType,
        "npi": data.npi,
        "tax_id": data.taxId,
        "address": data.address,
        "city": data.city,
        "state": data.state,
        "zip_code": data.zip,
        "phone": data.phone,
        "email": data.adminEmail,
        "contact_name": f"{data.adminFirstName} {data.adminLastName}",
        "created_at": datetime.utcnow().isoformat(),
        "status": "active",
        "subscription_tier": "trial",
        "trial_ends": (datetime.utcnow().replace(day=datetime.utcnow().day + 14)).isoformat()
    }
    
    # Store practice
    practices_db[practice_id] = practice
    
    # Create user record
    users_db[data.adminEmail] = {
        "email": data.adminEmail,
        "password_hash": password_hash,
        "practice_id": practice_id,
        "role": "admin",
        "name": f"{data.adminFirstName} {data.adminLastName}"
    }
    
    # Create access token
    from app.routers.auth import create_access_token
    access_token = create_access_token({"sub": user_id, "practice_id": practice_id})
    
    # Log registration
    await audit_logger.log(
        action=AuditAction.USER_CREATE,
        user_id=user_id,






































































    }        ]            {"cpt": "99214", "description": "Office visit, established, moderate complexity", "medicare": 130.00, "medicaid": 104.00, "commercial_avg": 175.00},            {"cpt": "99213", "description": "Office visit, established, low complexity", "medicare": 92.00, "medicaid": 73.60, "commercial_avg": 125.00},            {"cpt": "92250", "description": "Fundus photography", "medicare": 35.25, "medicaid": 28.20, "commercial_avg": 55.00},            {"cpt": "92134", "description": "OCT retina", "medicare": 42.50, "medicaid": 34.00, "commercial_avg": 75.00},            {"cpt": "92083", "description": "Visual field examination", "medicare": 67.75, "medicaid": 54.20, "commercial_avg": 95.00},            {"cpt": "92015", "description": "Refraction", "medicare": 46.00, "medicaid": 36.80, "commercial_avg": 65.00},            {"cpt": "92012", "description": "Intermediate eye exam, established", "medicare": 72.50, "medicaid": 58.00, "commercial_avg": 98.00},            {"cpt": "92002", "description": "Intermediate eye exam, new patient", "medicare": 92.75, "medicaid": 74.20, "commercial_avg": 125.00},            {"cpt": "92014", "description": "Comprehensive eye exam, established", "medicare": 108.25, "medicaid": 86.60, "commercial_avg": 145.00},            {"cpt": "92004", "description": "Comprehensive eye exam, new patient", "medicare": 152.50, "medicaid": 121.00, "commercial_avg": 195.00},        "codes": [        "source": "CMS Fee Schedule 2024",        "last_updated": "2024-01-15",    return {    """Get CPT fee schedule with Medicare, Medicaid, and commercial rates"""async def get_fee_schedule():@router.get("/fee-schedule")    return practice        raise HTTPException(status_code=404, detail="Practice not found")    if not practice:    practice = practices_db.get(practice_id)    """Get current practice details"""async def get_current_practice(practice_id: str):@router.get("/me")    )        practice_name=practice["practice_name"]        practice_id=user["practice_id"],        access_token=token,    return LoginResponse(        token = generate_token()            raise HTTPException(status_code=404, detail="Practice not found")    if not practice:    practice = practices_db.get(user["practice_id"])            raise HTTPException(status_code=401, detail="Invalid email or password")    if user["password_hash"] != hash_password(request.password):            raise HTTPException(status_code=401, detail="Invalid email or password")    if not user:    user = users_db.get(request.email)        """Login to practice account"""async def login(request: LoginRequest):@router.post("/login", response_model=LoginResponse)    )        message="Practice registered successfully"        access_token=access_token,        user_id=user_id,        practice_id=practice_id,        success=True,    return RegistrationResponse(        )        }            "admin_email": data.adminEmail,            "plan": data.billingPlan,            "practice_type": data.practiceType,            "practice_name": data.practiceName,        details={        practice_id=practice_id,