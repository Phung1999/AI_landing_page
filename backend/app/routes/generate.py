from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
import json
import uuid

from app.services.fallback_generator import generate_fallback_sections

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


def _is_valid_api_key(key: str | None) -> bool:
    """Kiểm tra xem API key có hợp lệ hay không."""
    if not key:
        return False
    if key in ("sk-your-key-here", "sk-...", ""):
        return False
    if not key.startswith("sk-"):
        return False
    return True


def _generate_with_openai(request: GenerateRequest) -> list[dict]:
    """Gọi OpenAI API để sinh landing page."""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
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
        raise ValueError("Empty response from AI")

    data = json.loads(content)
    sections = []

    for section in data.get("sections", []):
        sections.append({
            "id": str(uuid.uuid4()),
            "type": section.get("type"),
            "props": section.get("props", {})
        })

    return sections


@router.post("/generate")
async def generate_landing(request: GenerateRequest) -> dict:
    if not request.type or not request.description:
        raise HTTPException(status_code=400, detail="Type and description are required")

    api_key = os.getenv("OPENAI_API_KEY")

    # Nếu có API key hợp lệ, thử gọi OpenAI trước
    if _is_valid_api_key(api_key):
        try:
            sections = _generate_with_openai(request)
            return {"sections": sections}
        except Exception as e:
            # Nếu OpenAI lỗi, fallback sang generator nội bộ
            print(f"[WARNING] OpenAI API failed: {e}. Using fallback generator.")

    # Fallback: sinh landing page mẫu dựa trên loại và mô tả
    print(f"[INFO] Using fallback generator for type={request.type}")
    sections = generate_fallback_sections(request.type, request.description)
    return {"sections": sections}