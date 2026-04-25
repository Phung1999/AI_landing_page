from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routes import generate, templates, export, refine, clone

app = FastAPI(
    title="AI Landing Page Generator API",
    description="API for generating AI-powered landing pages",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api", tags=["generate"])
app.include_router(templates.router, prefix="/api", tags=["templates"])
app.include_router(export.router, prefix="/api", tags=["export"])
app.include_router(refine.router, prefix="/api", tags=["refine"])
app.include_router(clone.router, prefix="/api", tags=["clone"])


@app.get("/")
def root():
    return {"message": "AI Landing Page Generator API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}