from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.orm import sessionmaker
from datetime import datetime

class Base(DeclarativeBase):
    pass

engine = create_engine("sqlite:///./projects.db", echo=False)
SessionLocal = sessionmaker(bind=engine)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    url: Mapped[str | None] = mapped_column(String(512))
    landing_type: Mapped[str] = mapped_column(String(50))
    sections: Mapped[list] = mapped_column(JSON)
    theme: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


Base.metadata.create_all(bind=engine)


def create_project(name: str, landing_type: str, sections: list, theme: dict = None, url: str = None):
    db = SessionLocal()
    project = Project(
        name=name,
        url=url,
        landing_type=landing_type,
        sections=sections,
        theme=theme or {}
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    db.close()
    return project


def get_all_projects():
    db = SessionLocal()
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    db.close()
    return projects


def get_project_by_id(project_id: int):
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    db.close()
    return project


def delete_project(project_id: int):
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    if project:
        db.delete(project)
        db.commit()
    db.close()
    return project