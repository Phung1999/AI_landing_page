from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import generate, templates

load_dotenv()

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


@app.get("/")
def root():
    return {"message": "AI Landing Page Generator API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}