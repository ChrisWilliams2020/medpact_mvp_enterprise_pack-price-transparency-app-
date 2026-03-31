"""
Practice registration and management endpoints
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from passlib.hash import bcrypt
import uuid

from app.db import get_db
from app.core.audit import audit_logger, AuditAction

router = APIRouter()


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
    
    # Generate IDs
    practice_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())
    
    # Hash password
    password_hash = bcrypt.hash(data.adminPassword)
    
    # TODO: Save to database
    # For now, we'll return success with mock token
    
    # Create access token
    from app.routers.auth import create_access_token
    access_token = create_access_token({"sub": user_id, "practice_id": practice_id})
    
    # Log registration
    await audit_logger.log(
        action=AuditAction.USER_CREATE,
        user_id=user_id,
        practice_id=practice_id,
        details={
            "practice_name": data.practiceName,
            "practice_type": data.practiceType,
            "plan": data.billingPlan,
            "admin_email": data.adminEmail,
        }
    )
    
    return RegistrationResponse(
        success=True,
        practice_id=practice_id,
        user_id=user_id,
        access_token=access_token,
        message="Practice registered successfully"
    )


@router.get("/fee-schedule")
async def get_fee_schedule(
    category: Optional[str] = None,
    search: Optional[str] = None,
):
    """
    Get CPT fee schedule with Medicare, Medicaid, and commercial rates
    """
    # In production, this would come from a database
    # For now, return the embedded data
    
    cpt_codes = [
        {"code": "92002", "description": "Eye exam, new patient, intermediate", "category": "Eye Exams", "medicareRate": 72.50, "medicaidRate": 58.00, "commercialRateLow": 85.00, "commercialRateHigh": 150.00, "nationalAverage": 115.00},
        {"code": "92004", "description": "Eye exam, new patient, comprehensive", "category": "Eye Exams", "medicareRate": 145.00, "medicaidRate": 116.00, "commercialRateLow": 175.00, "commercialRateHigh": 275.00, "nationalAverage": 220.00},
        {"code": "92012", "description": "Eye exam, established patient, intermediate", "category": "Eye Exams", "medicareRate": 62.00, "medicaidRate": 49.60, "commercialRateLow": 75.00, "commercialRateHigh": 125.00, "nationalAverage": 95.00},
        {"code": "92014", "description": "Eye exam, established patient, comprehensive", "category": "Eye Exams", "medicareRate": 108.00, "medicaidRate": 86.40, "commercialRateLow": 130.00, "commercialRateHigh": 200.00, "nationalAverage": 165.00},
        {"code": "92015", "description": "Refraction", "category": "Refraction", "medicareRate": 0, "medicaidRate": 35.00, "commercialRateLow": 35.00, "commercialRateHigh": 75.00, "nationalAverage": 50.00},
        {"code": "92083", "description": "Visual field exam, extended", "category": "Diagnostic", "medicareRate": 55.00, "medicaidRate": 44.00, "commercialRateLow": 65.00, "commercialRateHigh": 110.00, "nationalAverage": 85.00},
        {"code": "92133", "description": "OCT, optic nerve", "category": "Diagnostic", "medicareRate": 45.00, "medicaidRate": 36.00, "commercialRateLow": 55.00, "commercialRateHigh": 95.00, "nationalAverage": 72.00},
        {"code": "92134", "description": "OCT, retina", "category": "Diagnostic", "medicareRate": 45.00, "medicaidRate": 36.00, "commercialRateLow": 55.00, "commercialRateHigh": 95.00, "nationalAverage": 72.00},
    ]
    
    # Apply filters
    if category:
        cpt_codes = [c for c in cpt_codes if c["category"].lower() == category.lower()]
    
    if search:
        search_lower = search.lower()
        cpt_codes = [c for c in cpt_codes if search_lower in c["code"].lower() or search_lower in c["description"].lower()]
    
    return {"codes": cpt_codes, "total": len(cpt_codes)}