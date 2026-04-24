from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()


class RefineRequest(BaseModel):
    sections: list
    theme: dict
    prompt: str


REFINE_SYSTEM_PROMPT = """Bạn là một landing page editor chuyên nghiệp.
Nhiệm vụ của bạn là cập nhật JSON của landing page dựa trên yêu cầu của người dùng.

Dữ liệu hiện tại:
Sections: {sections}
Theme: {theme}

Yêu cầu thay đổi: {prompt}

Hãy trả về JSON mới với cấu trúc tương tự (KHÔNG có gì khác ngoài JSON):
{{
  "sections": [...],
  "theme": {{ "primaryColor": "...", "fontFamily": "..." }}
}}

Lưu ý:
- Giữ nguyên các ID của section nếu không có yêu cầu xóa hoặc thêm mới.
- Chỉ thay đổi những phần được yêu cầu.
- Đảm bảo tính nhất quán của giao diện.
"""


@router.post("/refine")
async def refine_landing(request: RefineRequest) -> dict:
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    try:
        prompt = REFINE_SYSTEM_PROMPT.format(
            sections=json.dumps(request.sections),
            theme=json.dumps(request.theme),
            prompt=request.prompt
        )

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": request.prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
