from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
import hashlib
import secrets

app = FastAPI(
    title="MedPact Practice Intelligence API",
    description="API for eyecare practice analytics and management",
    version="3.4.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
practices_db = {}
users_db = {}
tokens_db = {}

# ============== Models ==============
class PracticeRegistration(BaseModel):
    practice_name: str
    practice_type: str
    npi: str
    tax_id: Optional[str] = None
    address: str
    city: str
    state: str
    zip_code: str
    phone: str
    email: EmailStr
    contact_name: str
    password: str
    emr_system: Optional[str] = None
    accept_baa: bool = False

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ============== Helpers ==============
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

# ============== Health Check ==============
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "3.4.0"}

@app.get("/")
async def root():
    return {"message": "MedPact Practice Intelligence API v3.4", "docs": "/docs"}

# ============== Practice Registration ==============
@app.post("/api/practices/register")
async def register_practice(registration: PracticeRegistration):
    """Register a new practice"""
    
    if not registration.accept_baa:
        raise HTTPException(status_code=400, detail="BAA must be accepted to register")
    
    if registration.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    for practice in practices_db.values():
        if practice["npi"] == registration.npi:
            raise HTTPException(status_code=400, detail="NPI already registered")
    
    practice_id = f"prac_{secrets.token_hex(8)}"
    
    practice = {
        "id": practice_id,
        "practice_name": registration.practice_name,
        "practice_type": registration.practice_type,
        "npi": registration.npi,
        "tax_id": registration.tax_id,
        "address": registration.address,
        "city": registration.city,
        "state": registration.state,
        "zip_code": registration.zip_code,
        "phone": registration.phone,
        "email": registration.email,
        "contact_name": registration.contact_name,
        "emr_system": registration.emr_system,
        "created_at": datetime.utcnow().isoformat(),
        "status": "active",
        "subscription_tier": "trial",
        "trial_ends": (datetime.utcnow() + timedelta(days=14)).isoformat()
    }
    
    practices_db[practice_id] = practice
    
    users_db[registration.email] = {
        "email": registration.email,
        "password_hash": hash_password(registration.password),
        "practice_id": practice_id,
        "role": "admin",
        "name": registration.contact_name
    }
    
    # Auto-generate token for immediate login
    token = generate_token()
    tokens_db[token] = practice_id
    
    return {
        "id": practice_id,
        "practice_name": registration.practice_name,
        "practice_type": registration.practice_type,
        "npi": registration.npi,
        "email": registration.email,
        "created_at": practice["created_at"],
        "status": "active",
        "access_token": token
    }

# ============== Authentication ==============
@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Login to practice account"""
    
    user = users_db.get(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if user["password_hash"] != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    practice = practices_db.get(user["practice_id"])
    if not practice:
        raise HTTPException(status_code=404, detail="Practice not found")
    
    token = generate_token()
    tokens_db[token] = user["practice_id"]
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "practice_id": user["practice_id"],
        "practice_name": practice["practice_name"],
        "user_name": user["name"],
        "role": user["role"]
    }

@app.post("/api/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

# ============== Fee Schedule ==============
@app.get("/api/practices/fee-schedule")
async def get_fee_schedule():
    """Get CPT fee schedule with Medicare, Medicaid, and commercial rates"""
    return {
        "last_updated": "2024-01-15",
        "source": "CMS Fee Schedule 2024",
        "codes": [
            {"cpt": "92004", "description": "Comprehensive eye exam, new patient", "medicare": 152.50, "medicaid": 121.00, "commercial_avg": 195.00, "your_fee": 175.00},
            {"cpt": "92014", "description": "Comprehensive eye exam, established", "medicare": 108.25, "medicaid": 86.60, "commercial_avg": 145.00, "your_fee": 125.00},
            {"cpt": "92002", "description": "Intermediate eye exam, new patient", "medicare": 92.75, "medicaid": 74.20, "commercial_avg": 125.00, "your_fee": 110.00},
            {"cpt": "92012", "description": "Intermediate eye exam, established", "medicare": 72.50, "medicaid": 58.00, "commercial_avg": 98.00, "your_fee": 85.00},
            {"cpt": "92015", "description": "Refraction", "medicare": 46.00, "medicaid": 36.80, "commercial_avg": 65.00, "your_fee": 45.00},
            {"cpt": "92083", "description": "Visual field examination", "medicare": 67.75, "medicaid": 54.20, "commercial_avg": 95.00, "your_fee": 85.00},
            {"cpt": "92134", "description": "OCT retina", "medicare": 42.50, "medicaid": 34.00, "commercial_avg": 75.00, "your_fee": 65.00},
            {"cpt": "92250", "description": "Fundus photography", "medicare": 35.25, "medicaid": 28.20, "commercial_avg": 55.00, "your_fee": 50.00},
            {"cpt": "99213", "description": "Office visit, established, low complexity", "medicare": 92.00, "medicaid": 73.60, "commercial_avg": 125.00, "your_fee": 110.00},
            {"cpt": "99214", "description": "Office visit, established, moderate complexity", "medicare": 130.00, "medicaid": 104.00, "commercial_avg": 175.00, "your_fee": 155.00},
            {"cpt": "99215", "description": "Office visit, established, high complexity", "medicare": 178.00, "medicaid": 142.40, "commercial_avg": 225.00, "your_fee": 195.00},
            {"cpt": "92136", "description": "Ophthalmic biometry", "medicare": 58.00, "medicaid": 46.40, "commercial_avg": 85.00, "your_fee": 75.00},
            {"cpt": "92020", "description": "Gonioscopy", "medicare": 38.50, "medicaid": 30.80, "commercial_avg": 55.00, "your_fee": 45.00},
            {"cpt": "92285", "description": "External ocular photography", "medicare": 22.00, "medicaid": 17.60, "commercial_avg": 35.00, "your_fee": 30.00},
        ]
    }

# ============== Dashboard Stats ==============
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    return {
        "revenue": {
            "current_month": 127500,
            "previous_month": 118200,
            "change_percent": 7.9,
            "ytd": 892450,
            "target": 1200000
        },
        "patients": {
            "total": 2847,
            "active": 2156,
            "new_this_month": 142,
            "change_percent": 5.2
        },
        "appointments": {
            "today": 24,
            "completed_today": 18,
            "this_week": 127,
            "utilization_percent": 87,
            "no_shows": 3
        },
        "claims": {
            "pending": 47,
            "submitted": 156,
            "approved": 892,
            "denied": 12,
            "denial_rate": 1.3,
            "avg_days_to_payment": 18
        },
        "collections": {
            "outstanding": 45670,
            "over_30_days": 12340,
            "over_60_days": 5670,
            "over_90_days": 2340
        }
    }

# ============== Top Procedures ==============
@app.get("/api/dashboard/top-procedures")
async def get_top_procedures():
    """Get top procedures by volume and revenue"""
    return {
        "by_volume": [
            {"cpt": "92014", "description": "Comp exam, established", "count": 312, "revenue": 39000},
            {"cpt": "92015", "description": "Refraction", "count": 298, "revenue": 13410},
            {"cpt": "92134", "description": "OCT retina", "count": 187, "revenue": 12155},
            {"cpt": "99213", "description": "Office visit, low", "count": 156, "revenue": 17160},
            {"cpt": "92083", "description": "Visual field", "count": 98, "revenue": 8330}
        ],
        "by_revenue": [
            {"cpt": "92014", "description": "Comp exam, established", "count": 312, "revenue": 39000},
            {"cpt": "99213", "description": "Office visit, low", "count": 156, "revenue": 17160},
            {"cpt": "92015", "description": "Refraction", "count": 298, "revenue": 13410},
            {"cpt": "92134", "description": "OCT retina", "count": 187, "revenue": 12155},
            {"cpt": "92083", "description": "Visual field", "count": 98, "revenue": 8330}
        ]
    }

# ============== Benchmarks ==============
@app.get("/api/benchmarks")
async def get_benchmarks():
    """Get practice benchmarks vs peers"""
    return {
        "your_practice": {
            "revenue_per_patient": 245,
            "revenue_per_exam": 187,
            "patient_volume": 2847,
            "exams_per_day": 18.5,
            "collection_rate": 94.2,
            "denial_rate": 1.3,
            "avg_wait_time": 12,
            "patient_satisfaction": 4.7,
            "optical_capture_rate": 62,
            "contact_lens_revenue_percent": 18
        },
        "peer_average": {
            "revenue_per_patient": 218,
            "revenue_per_exam": 165,
            "patient_volume": 2100,
            "exams_per_day": 14.2,
            "collection_rate": 89.5,
            "denial_rate": 3.8,
            "avg_wait_time": 18,
            "patient_satisfaction": 4.2,
            "optical_capture_rate": 54,
            "contact_lens_revenue_percent": 15
        },
        "top_10_percent": {
            "revenue_per_patient": 285,
            "revenue_per_exam": 215,
            "patient_volume": 3500,
            "exams_per_day": 22.0,
            "collection_rate": 97.1,
            "denial_rate": 0.8,
            "avg_wait_time": 8,
            "patient_satisfaction": 4.9,
            "optical_capture_rate": 72,
            "contact_lens_revenue_percent": 22
        },
        "percentile_rank": {
            "revenue_per_patient": 78,
            "collection_rate": 82,
            "denial_rate": 91,
            "patient_satisfaction": 85
        }
    }

# ============== Payer Mix ==============
@app.get("/api/payer-mix")
async def get_payer_mix():
    """Get payer mix analysis"""
    return {
        "summary": {
            "total_revenue": 127500,
            "total_patients": 2847,
            "payer_count": 6
        },
        "payers": [
            {"name": "VSP", "percentage": 32, "revenue": 40800, "patients": 911, "avg_reimbursement": 44.78, "trend": "up"},
            {"name": "EyeMed", "percentage": 24, "revenue": 30600, "patients": 683, "avg_reimbursement": 44.80, "trend": "stable"},
            {"name": "Medicare", "percentage": 18, "revenue": 22950, "patients": 512, "avg_reimbursement": 44.82, "trend": "up"},
            {"name": "Blue Cross", "percentage": 12, "revenue": 15300, "patients": 342, "avg_reimbursement": 44.74, "trend": "down"},
            {"name": "Aetna", "percentage": 8, "revenue": 10200, "patients": 228, "avg_reimbursement": 44.74, "trend": "stable"},
            {"name": "Self-Pay", "percentage": 6, "revenue": 7650, "patients": 171, "avg_reimbursement": 44.74, "trend": "up"}
        ],
        "recommendations": [
            "VSP volume increased 8% - consider negotiating better rates",
            "Blue Cross reimbursement trending down - review contract terms",
            "Self-pay patients increasing - implement payment plans"
        ]
    }

# ============== AI Insights ==============
@app.get("/api/ai-insights")
async def get_ai_insights():
    """Get AI-powered insights and recommendations"""
    return {
        "generated_at": datetime.utcnow().isoformat(),
        "insights": [
            {
                "id": 1,
                "type": "revenue",
                "priority": "high",
                "icon": "💰",
                "title": "Underpriced Refractions Detected",
                "description": "Your refraction fee ($45) is 31% below market average ($65). Based on your volume of 298 refractions/month, increasing to $55 could generate additional revenue.",
                "potential_impact": 14900,
                "confidence": 0.92,
                "action": "Review Fee Schedule",
                "action_url": "/fee-schedule"
            },
            {
                "id": 2,
                "type": "efficiency",
                "priority": "high",
                "icon": "📊",
                "title": "OCT Utilization Opportunity",
                "description": "Only 42% of your diabetic patients (187 of 445) received OCT imaging this year. Industry best practice is 85%+. This represents both a care quality and revenue opportunity.",
                "potential_impact": 23400,
                "confidence": 0.88,
                "action": "Review Diabetic Protocol",
                "action_url": "/protocols"
            },
            {
                "id": 3,
                "type": "claims",
                "priority": "high",
                "icon": "⚠️",
                "title": "VSP Claim Denials Trending Up",
                "description": "VSP denials increased from 1.2% to 3.3% this month. Primary reason: missing pre-authorization (67% of denials). Estimated revenue at risk.",
                "potential_impact": 8200,
                "confidence": 0.95,
                "action": "Review VSP Claims",
                "action_url": "/claims?payer=vsp"
            },
            {
                "id": 4,
                "type": "scheduling",
                "priority": "medium",
                "icon": "📅",
                "title": "Tuesday Afternoon Underutilized",
                "description": "Tuesday 2-5pm slots are only 45% booked vs 87% practice average. Consider targeted recall campaigns for these slots.",
                "potential_impact": 12600,
                "confidence": 0.85,
                "action": "View Schedule Analytics",
                "action_url": "/scheduling"
            },
            {
                "id": 5,
                "type": "optical",
                "priority": "medium",
                "icon": "👓",
                "title": "Optical Capture Rate Below Benchmark",
                "description": "Your optical capture rate (62%) is below top performers (72%). Patients purchasing elsewhere represent $34,200 in potential annual revenue.",
                "potential_impact": 34200,
                "confidence": 0.79,
                "action": "Review Optical Strategy",
                "action_url": "/optical"
            }
        ],
        "summary": {
            "total_opportunities": 5,
            "total_potential_impact": 93300,
            "high_priority_count": 3
        }
    }

# ============== Patients ==============
@app.get("/api/patients")
async def get_patients():
    """Get patient list"""
    return {
        "total": 2847,
        "page": 1,
        "per_page": 20,
        "patients": [
            {"id": "p001", "name": "John Smith", "dob": "1965-03-15", "last_visit": "2024-01-10", "next_appointment": "2024-04-10", "insurance": "VSP", "balance": 0},
            {"id": "p002", "name": "Maria Garcia", "dob": "1978-07-22", "last_visit": "2024-01-08", "next_appointment": None, "insurance": "EyeMed", "balance": 45.00},
            {"id": "p003", "name": "Robert Johnson", "dob": "1952-11-30", "last_visit": "2024-01-05", "next_appointment": "2024-02-05", "insurance": "Medicare", "balance": 0},
            {"id": "p004", "name": "Sarah Williams", "dob": "1989-04-18", "last_visit": "2024-01-03", "next_appointment": None, "insurance": "Blue Cross", "balance": 125.00},
            {"id": "p005", "name": "Michael Brown", "dob": "1971-09-08", "last_visit": "2023-12-28", "next_appointment": "2024-03-28", "insurance": "Aetna", "balance": 0},
        ]
    }

# ============== Appointments ==============
@app.get("/api/appointments")
async def get_appointments():
    """Get appointments"""
    today = datetime.utcnow().strftime("%Y-%m-%d")
    return {
        "date": today,
        "appointments": [
            {"id": "a001", "time": "08:00", "patient": "John Smith", "type": "Comprehensive Exam", "provider": "Dr. Williams", "status": "completed"},
            {"id": "a002", "time": "08:30", "patient": "Maria Garcia", "type": "Follow-up", "provider": "Dr. Williams", "status": "completed"},
            {"id": "a003", "time": "09:00", "patient": "Robert Johnson", "type": "Diabetic Eye Exam", "provider": "Dr. Williams", "status": "completed"},
            {"id": "a004", "time": "09:30", "patient": "Sarah Williams", "type": "Contact Lens Fit", "provider": "Dr. Chen", "status": "in-progress"},
            {"id": "a005", "time": "10:00", "patient": "Michael Brown", "type": "Comprehensive Exam", "provider": "Dr. Williams", "status": "checked-in"},
            {"id": "a006", "time": "10:30", "patient": "Jennifer Davis", "type": "Glaucoma Check", "provider": "Dr. Chen", "status": "scheduled"},
            {"id": "a007", "time": "11:00", "patient": "David Miller", "type": "Comprehensive Exam", "provider": "Dr. Williams", "status": "scheduled"},
            {"id": "a008", "time": "11:30", "patient": "Lisa Anderson", "type": "Pediatric Exam", "provider": "Dr. Chen", "status": "scheduled"},
        ]
    }

# ============== Claims ==============
@app.get("/api/claims")
async def get_claims():
    """Get claims data"""
    return {
        "summary": {
            "pending": 47,
            "submitted": 156,
            "approved": 892,
            "denied": 12,
            "total_pending_amount": 28450,
            "avg_days_to_payment": 18
        },
        "recent_claims": [
            {"id": "c001", "patient": "John Smith", "date": "2024-01-10", "amount": 245.00, "payer": "VSP", "status": "approved", "paid": 198.50},
            {"id": "c002", "patient": "Maria Garcia", "date": "2024-01-08", "amount": 180.00, "payer": "EyeMed", "status": "pending", "paid": 0},
            {"id": "c003", "patient": "Robert Johnson", "date": "2024-01-05", "amount": 312.00, "payer": "Medicare", "status": "approved", "paid": 285.00},
            {"id": "c004", "patient": "Sarah Williams", "date": "2024-01-03", "amount": 425.00, "payer": "Blue Cross", "status": "denied", "paid": 0, "denial_reason": "Prior auth required"},
            {"id": "c005", "patient": "Michael Brown", "date": "2023-12-28", "amount": 198.00, "payer": "Aetna", "status": "submitted", "paid": 0},
        ],
        "denials_by_reason": [
            {"reason": "Prior authorization required", "count": 5, "amount": 2450},
            {"reason": "Service not covered", "count": 3, "amount": 890},
            {"reason": "Timely filing", "count": 2, "amount": 567},
            {"reason": "Invalid diagnosis code", "count": 2, "amount": 423}
        ]
    }

# ============== Reports ==============
@app.get("/api/reports/revenue")
async def get_revenue_report():
    """Get revenue report data"""
    return {
        "monthly": [
            {"month": "Jan", "revenue": 118200, "collections": 112500, "target": 115000},
            {"month": "Feb", "revenue": 122400, "collections": 118900, "target": 115000},
            {"month": "Mar", "revenue": 127500, "collections": 121200, "target": 120000},
            {"month": "Apr", "revenue": 0, "collections": 0, "target": 120000},
        ],
        "by_category": [
            {"category": "Professional Services", "amount": 78500, "percentage": 61.6},
            {"category": "Optical Sales", "amount": 32400, "percentage": 25.4},
            {"category": "Contact Lenses", "amount": 12800, "percentage": 10.0},
            {"category": "Other", "amount": 3800, "percentage": 3.0}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
