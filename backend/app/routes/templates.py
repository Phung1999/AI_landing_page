from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class Template(BaseModel):
    id: str
    name: str
    type: str
    description: str
    sections: list[dict]


TEMPLATES = [
    {
        "id": "course-1",
        "name": "Khoa hoc co ban",
        "type": "course",
        "description": "Template cho khoa hoc online",
        "sections": [
            {
                "id": "hero-1",
                "type": "hero",
                "props": {
                    "title": "Hoc [Ten ky nang] trong [Thoi gian]",
                    "subtitle": "Khoa hoc duoc thiet de de ban co the ap dung ngay lap tuc",
                    "cta": "Dang ky ngay",
                    "ctaLink": "#register"
                }
            },
            {
                "id": "features-1",
                "type": "features",
                "props": {
                    "items": [
                        {"icon": "clock", "title": "Hoc theo toc do", "description": "Hoc moi luc moi noi"},
                        {"icon": "users", "title": "Ho tro 24/7", "description": "Giai dap moi thac mac"},
                        {"icon": "award", "title": "Chung chi", "description": "Co chung nhan hoan thanh"}
                    ]
                }
            },
            {
                "id": "cta-1",
                "type": "cta",
                "props": {
                    "title": "San sang bat dau?",
                    "description": "Tham gia ngay hom nay de nhan uu dai",
                    "buttonText": "Dang ky ngay"
                }
            }
        ]
    },
    {
        "id": "saas-1",
        "name": "SaaS Product",
        "type": "saas",
        "description": "Template cho san pham SaaS",
        "sections": [
            {
                "id": "hero-1",
                "type": "hero",
                "props": {
                    "title": "Giai phap tot nhat cho doanh nghiep",
                    "subtitle": "Tang nang suat va giam chi phi voi cong cu cua chung toi",
                    "cta": "Dung thu mien phi",
                    "ctaLink": "#trial"
                }
            },
            {
                "id": "features-1",
                "type": "features",
                "props": {
                    "items": [
                        {"icon": "zap", "title": "Nhanh chong", "description": "Thiet lap trong 5 phut"},
                        {"icon": "shield", "title": "Bao mat", "description": "Duoc ma hoa"},
                        {"icon": "headphones", "title": "Ho tro", "description": "Luon co mat khi can"}
                    ]
                }
            },
            {
                "id": "pricing-1",
                "type": "pricing",
                "props": {
                    "plans": [
                        {"name": "Mien phi", "price": "0d", "features": ["Cho 1 nguoi dung"], "cta": "Bat dau"},
                        {"name": "Pro", "price": "299k/thang", "features": ["Khong gioi han", "Ho tro uu tien"], "cta": "Dang ky", "highlight": True}
                    ]
                }
            },
            {
                "id": "cta-1",
                "type": "cta",
                "props": {
                    "title": "Bat dau mien phi",
                    "description": "Khong can the tin dung",
                    "buttonText": "Dung thu"
                }
            }
        ]
    },
    {
        "id": "product-1",
        "name": "San pham thuong mai",
        "type": "product",
        "description": "Template cho san pham ban le",
        "sections": [
            {
                "id": "hero-1",
                "type": "hero",
                "props": {
                    "title": "[Ten san pham]",
                    "subtitle": "San pham chat luong cao, gia tot nhat",
                    "cta": "Mua ngay",
                    "ctaLink": "#buy"
                }
            },
            {
                "id": "features-1",
                "type": "features",
                "props": {
                    "items": [
                        {"icon": "badge-check", "title": "Chinh hang", "description": "100% authentic"},
                        {"icon": "truck", "title": "Giao hang", "description": "Mien phi toan quoc"},
                        {"icon": "rotate-ccw", "title": "Doi tra", "description": "30 ngay doi tra"}
                    ]
                }
            },
            {
                "id": "cta-1",
                "type": "cta",
                "props": {
                    "title": "Dat hang ngay",
                    "description": "Giao hang trong 24h",
                    "buttonText": "Mua ngay"
                }
            }
        ]
    }
]


@router.get("/templates")
async def get_templates(type: Optional[str] = None) -> dict:
    if type:
        filtered = [t for t in TEMPLATES if t["type"] == type]
        return {"templates": filtered}
    return {"templates": TEMPLATES}


@router.get("/templates/{template_id}")
async def get_template(template_id: str) -> dict:
    template = next((t for t in TEMPLATES if t["id"] == template_id), None)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"template": template}