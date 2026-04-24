from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
import json
import uuid

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()


class GenerateRequest(BaseModel):
    type: str
    description: str


class Section(BaseModel):
    type: str
    props: dict


class GenerateResponse(BaseModel):
    sections: list[Section]


SYSTEM_PROMPT = """Bạn là một landing page generator chuyên nghiệp.

Nhiệm vụ:
- Tạo landing page chuyển đổi cao
- Phù hợp thị trường Việt Nam
- Hiện đại, tin cậy

Output: JSON theo schema sau (KHÔNG có gì khác ngoài JSON):
{
  "sections": [
    {
      "type": "hero",
      "props": {
        "title": "Tiêu đề chính",
        "subtitle": "Mô tả phụ",
        "cta": "Nút bấm",
        "ctaLink": "#"
      }
    },
    {
      "type": "features",
      "props": {
        "items": [
          {"icon": "check", "title": "Tiêu đề", "description": "Mô tả"}
        ]
      }
    },
    {
      "type": "testimonials",
      "props": {
        "items": [
          {"name": "Tên", "content": "Nội dung", "rating": 5}
        ]
      }
    },
    {
      "type": "pricing",
      "props": {
        "plans": [
          {"name": "Tên gói", "price": "Giá", "features": ["Tính năng"], "cta": "Mua ngay"}
        ]
      }
    },
    {
      "type": "cta",
      "props": {
        "title": "Tiêu đề",
        "description": "Mô tả",
        "buttonText": "Nút bấm"
      }
    },
    {
      "type": "footer",
      "props": {
        "links": [{"label": "Liên kết", "href": "#"}]
      }
    }
  ]
}

Loại landing page: {type}
Mô tả: {description}

Chỉ trả về JSON, không có text khác."""


@router.post("/generate")
async def generate_landing(request: GenerateRequest) -> dict:
    if not request.type or not request.description:
        raise HTTPException(status_code=400, detail="Type and description are required")

    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")

    try:
        prompt = SYSTEM_PROMPT.format(type=request.type, description=request.description)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"Tạo landing page loại {request.type}: {request.description}"}
            ],
            temperature=0.7,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        if not content:
            raise HTTPException(status_code=500, detail="Empty response from AI")

        data = json.loads(content)
        sections = []

        for section in data.get("sections", []):
            sections.append({
                "id": str(uuid.uuid4()),
                "type": section.get("type"),
                "props": section.get("props", {})
            })

        return {"sections": sections}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))