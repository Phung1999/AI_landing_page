from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.export_service import generate_html

router = APIRouter()


class ExportRequest(BaseModel):
    sections: list
    theme: dict


@router.post("/export")
async def export_landing(request: ExportRequest) -> dict:
    if not request.sections:
        raise HTTPException(status_code=400, detail="Sections are required")

    try:
        html = generate_html(request.sections, request.theme)
        return {"html": html}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
