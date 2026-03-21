"""MedPact Practice Intelligence API v2.3.0"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MedPact API", version="2.3.0")

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
    return {"enabled": False, "user": {"id": "demo", "email": "demo@medpact.ai", "name": "Demo User", "role": "admin", "practice_id": "demo"}}

@app.get("/imports")
async def imports():
    return {"imports": [], "status": "ready"}

@app.get("/imports/events")
async def import_events():
    return {"events": []}

@app.get("/metrics/catalog")
async def metrics_catalog():
    return {"categories": [
        {"id": "revenue", "name": "Revenue Metrics", "metrics": ["total_revenue", "collections_rate"]},
        {"id": "operations", "name": "Operational Metrics", "metrics": ["patient_volume", "wait_time", "no_show_rate"]},
        {"id": "productivity", "name": "Productivity Metrics", "metrics": ["provider_productivity"]}
    ]}

@app.get("/metrics/entries")
async def metrics_entries(practice_id: str = "demo"):
    return {
        "practice_id": practice_id,
        "entries": [
            {"metric": "total_revenue", "value": 2450000, "period": "2024-Q4", "trend": 5.2},
            {"metric": "patient_volume", "value": 1250, "period": "2024-Q4", "trend": 3.1},
            {"metric": "collections_rate", "value": 94.5, "period": "2024-Q4", "trend": 1.8},
            {"metric": "wait_time", "value": 12, "period": "2024-Q4", "trend": -8.5},
            {"metric": "no_show_rate", "value": 8.2, "period": "2024-Q4", "trend": -12.3},
            {"metric": "provider_productivity", "value": 32, "period": "2024-Q4", "trend": 4.2}
        ]
    }

@app.get("/metrics/events/")
async def metrics_events():
    return {"events": []}

@app.get("/practice/profile")
async def practice_profile():
    return {"id": "demo", "name": "Bay Area Eye Care", "specialty": "Ophthalmology", "providers": 4}

@app.get("/benchmarks")
@app.get("/benchmarks/peer")
async def benchmarks():
    return {"practice_percentile": 72, "metrics": {
        "revenue_per_provider": {"value": 612500, "percentile": 68},
        "collections_rate": {"value": 94.5, "percentile": 82},
        "patient_volume": {"value": 1250, "percentile": 68}
    }}

@app.get("/ai/insights")
async def ai_insights():
    return {"insights": [
        {"type": "opportunity", "title": "Revenue Optimization", "description": "Collections rate above peer average", "impact": "high"},
        {"type": "recommendation", "title": "Staffing", "description": "Consider adding 0.5 FTE", "impact": "medium"}
    ]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
