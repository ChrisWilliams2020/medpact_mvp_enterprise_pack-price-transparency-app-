from fastapi import Header, HTTPException, Request
from typing import Optional

# Very small auth stub for local MVP: map token -> practice_id
# Tests and local dev often don't set Authorization; allow a test-friendly fallback.
_TOKENS = {
    'token-practice-a': 'practice-a',
    'token-practice-b': 'practice-b',
}


def get_practice_id(request: Request, authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Resolve practice id from Authorization header or X-Practice-Id header.

    - If X-Practice-Id header is present, use it (useful for tests/CI).
    - If Authorization Bearer token is present, map via _TOKENS.
    - Otherwise return a safe default 'practice' to allow test flows.
    """
    # prefer explicit header used by tests
    header_pid = request.headers.get('X-Practice-Id') or request.query_params.get('practice_id')
    if header_pid:
        return header_pid

    if not authorization:
        # allow unauthenticated local/dev usage
        return 'practice'

    # Expect 'Bearer <token>'
    parts = authorization.split()
    if len(parts) != 2:
        raise HTTPException(status_code=401, detail='Invalid Authorization header')
    token = parts[1]
    pid = _TOKENS.get(token)
    if not pid:
        raise HTTPException(status_code=403, detail='Invalid token')
    return pid
