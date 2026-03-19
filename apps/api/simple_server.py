"""
MedPact Practice Intelligence - Simple API Server
Version 2.3.0 - For local development
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="MedPact Practice Intelligence API",
    version="2.3.0",
    description="Backend API for Practice Intelligence Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "2.3.0"}

@app.get("/auth/config")
async def auth_config():
    return {
        "enabled": False,
        "provider": "demo",
        "user": {"id": "demo", "email": "demo@medpact.ai", "name": "Demo User", "role": "admin", "practice_id": "demo-practice"}
    }

@app.get("/metrics/catalog")
async def metrics_catalog():
    return {"categories": [
        {"id": "revenue", "name": "Revenue Metrics", "metrics": ["total_revenue", "collections_rate"]},
        {"id": "operations", "name": "Operational Metrics", "metrics": ["patient_volume", "wait_time"]}
    ]}

@app.get("/metrics/entries")
async def metrics_entries(practice_id: str = "demo"):
    return {
        "practice_id": practice_id,
        "entries": [
            {"metric": "total_revenue", "value": 2450000, "period": "2024-Q4", "trend": 5.2},
            {"metric": "patient_volume", "value": 1250, "period": "2024-Q4", "trend": 3.1},
            {"metric": "collections_rate", "value": 94.5, "period": "2024-Q4", "trend": 1.8}
        ]
    }

@app.get("/metrics/events/")
async def metrics_events():
    return {"events": []}

@app.get("/practice/profile")
async def practice_profile():
    return {"id": "demo-practice", "name": "Bay Area Eye Care", "specialty": "Ophthalmology", "providers": 4}

@app.get("/benchmarks")
@app.get("/benchmarks/peer")
async def benchmarks():
    return {"practice_percentile": 72, "metrics": {"revenue_per_provider": {"value": 612500, "percentile": 68}}}

@app.get("/ai/insights")
async def ai_insights():
    return {"insights": [{"type": "opportunity", "title": "Revenue Optimization", "description": "Collections rate above peer average", "impact": "high"}]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
