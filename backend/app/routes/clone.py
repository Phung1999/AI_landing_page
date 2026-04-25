from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.clone_service import clone_landing_page
from app.models import create_project, get_all_projects, get_project_by_id, delete_project

router = APIRouter()


class CloneRequest(BaseModel):
    url: str
    name: str | None = None


class SaveProjectRequest(BaseModel):
    name: str
    landing_type: str
    sections: list
    theme: dict | None = None
    url: str | None = None


@router.post("/clone")
async def clone_url(request: CloneRequest):
    try:
        result = await clone_landing_page(request.url)
        
        if request.name:
            result["name"] = request.name
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/projects")
async def save_project(request: SaveProjectRequest):
    project = create_project(
        name=request.name,
        landing_type=request.landing_type,
        sections=request.sections,
        theme=request.theme,
        url=request.url
    )
    return {
        "id": project.id,
        "name": project.name,
        "landing_type": project.landing_type,
        "created_at": project.created_at.isoformat()
    }


@router.get("/projects")
async def list_projects():
    projects = get_all_projects()
    return [
        {
            "id": p.id,
            "name": p.name,
            "url": p.url,
            "landing_type": p.landing_type,
            "created_at": p.created_at.isoformat()
        }
        for p in projects
    ]


@router.get("/projects/{project_id}")
async def get_project(project_id: int):
    project = get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {
        "id": project.id,
        "name": project.name,
        "url": project.url,
        "landing_type": project.landing_type,
        "sections": project.sections,
        "theme": project.theme,
        "created_at": project.created_at.isoformat()
    }


@router.delete("/projects/{project_id}")
async def remove_project(project_id: int):
    project = delete_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}