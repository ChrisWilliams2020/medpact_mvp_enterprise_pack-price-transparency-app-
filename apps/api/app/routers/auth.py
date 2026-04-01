from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    """Redirect to practices login"""
    from .practices import login as practices_login, LoginRequest as PracticesLoginRequest
    return await practices_login(PracticesLoginRequest(email=request.email, password=request.password))