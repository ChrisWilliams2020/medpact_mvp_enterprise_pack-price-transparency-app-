"""
MedPact Practice Intelligence API
Version 2.1.1
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json

app = FastAPI(
    title="MedPact Practice Intelligence API",
    version="2.1.1",
    description="Backend API for Practice Intelligence Platform"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health():
    return {"status": "healthy", "version": "2.1.1"}

# Auth config
@app.get("/auth/config")
async def auth_config():
    return {
        "enabled": False,
        "provider": "demo",
        "user": {
            "id": "demo-user",
            "email": "demo@medpact.ai",
            "name": "Demo User",
            "role": "admin"
        }
    }

# Metrics catalog
@app.get("/metrics/catalog")
async def metrics_catalog():
    return {
        "categories": [
            {"id": "revenue", "name": "Revenue Metrics", "metrics": ["total_revenue", "avg_revenue_per_patient", "collections_rate"]},
            {"id": "operations", "name": "Operational Metrics", "metrics": ["patient_volume", "wait_time", "no_show_rate"]},
            {"id": "clinical", "name": "Clinical Metrics", "metrics": ["procedure_count", "diagnosis_mix", "referral_rate"]},
        ]
    }

# Metrics entries
@app.get("/metrics/entries")
async def metrics_entries(practice_id: str = "demo"):
    return {
        "practice_id": practice_id,
        "entries": [
            {"metric": "total_revenue", "value": 2450000, "period": "2024-Q4"},
            {"metric": "patient_volume", "value": 1250, "period": "2024-Q4"},
            {"metric": "collections_rate", "value": 94.5, "period": "2024-Q4"},
        ]
    }

# Metrics events
@app.get("/metrics/events/")
async def metrics_events():
    return {"events": []}

# Practice profile
@app.get("/practice/profile")
async def practice_profile():
    return {
        "id": "demo-practice",
        "name": "Bay Area Eye Care",
        "specialty": "Ophthalmology",
        "providers": 4,
        "locations": 2,
        "npi": "1234567890"
    }

# Benchmarks
@app.get("/benchmarks/peer")
async def peer_benchmarks():
    return {
        "practice_percentile": 72,
        "metrics": {
            "revenue_per_provider": {"value": 612500, "percentile": 68},
            "patient_volume": {"value": 312, "percentile": 75},
            "collections_rate": {"value": 94.5, "percentile": 82}
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
