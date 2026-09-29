from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router

app = FastAPI(
    title="CARBONWISE API",
    description=(
        "Pre-production carbon & energy decision-intelligence platform for stainless-steelmaking. "
        "Evaluates candidate scenarios, validates production feasibility, rejects infeasible paths, "
        "and identifies the lowest-carbon feasible scenario before the melt."
    ),
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production will restrict to exact frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": "CARBONWISE",
        "tagline": "The decision is made before the melt.",
        "status": "operational",
        "api_docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
