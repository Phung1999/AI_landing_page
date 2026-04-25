# AI Landing Page Generator - Project Plan

## 1. Project Overview

**Tên dự án:** AI Landing Page Generator  
**Mô tả:** Tool AI tự sinh landing page chuyển đổi cao từ mô tả text  
**Mục tiêu:** MVP trong 14 ngày, có thể kiếm tiền (SaaS)

---

## 2. Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **UI:** shadcn/ui + Tailwind CSS v4
- **State:** Zustand
- **Editor:** dnd-kit (Drag & Drop)
- **Preview:** iframe sandbox

### Backend
- **API:** FastAPI (Python)
- **AI:** OpenAI API (GPT-4o)
- **Database:** SQLite + SQLAlchemy (MVP), Supabase (production)

### Development
- **Language:** TypeScript (Frontend), Python (Backend)
- **Package Manager:** npm + pip
- **Code Quality:** ESLint, Prettier, ruff

---

## 3. Core Features

### Phase 1: MVP (Ngày 1-7)
- [ ] Input form: loại landing page + mô tả
- [ ] AI → JSON Schema Generator
- [ ] JSON → Component Renderer
- [ ] Live Preview (iframe)
- [ ] 3 Template cơ bản: Course, SaaS, Product

### Phase 2: UX (Ngày 8-14)
- [ ] Multi-step Wizard Input
- [ ] Inline Text Editor
- [ ] Theme Customizer (màu, font)
- [ ] Export HTML/CSS

### Phase 3: Nâng cao (Ngày 15-28)
- [ ] Drag & Drop Editor
- [ ] Template Gallery
- [ ] AI Refinement (chỉnh sửa bằng text)
- [ ] Deploy tích hợp (Vercel/Netlify)

---

## 4. Component System

```
components/
├── sections/
│   ├── Hero/
│   ├── Features/
│   ├── Testimonials/
│   ├── Pricing/
│   ├── CTA/
│   └── Footer/
├── ui/
│   ├── Button/
│   ├── Input/
│   └── ...
└── editor/
    ├── DragDrop/
    └── InlineEdit/
```

---

## 5. API Specs

### POST /api/generate
```json
Input: { "type": "course", "description": "..." }
Output: { "sections": [...] }
```

### GET /api/templates
```json
Output: [{ "id": "course-1", "name": "..." }]
```

### POST /api/export
```json
Input: { "sections": [...] }
Output: { "html": "...", "css": "..." }
```

---

## 6. AI Prompt Engineering

### System Prompt (Core)
```
You are a landing page generator.
Output JSON only.
Use sections: hero, features, testimonials, pricing, CTA.
Tone: modern, conversion focused.
Target: Vietnamese users.
```

### JSON Schema
```json
{
  "type": "object",
  "properties": {
    "sections": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "title": { "type": "string" },
          "content": { "type": "string" }
        }
      }
    }
  }
}
```

---

## 7. Project Structure

```
ai-landing-page/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── sections/
│   │   └── editor/
│   ├── lib/
│   │   ├── utils.ts
│   │   └── ai.ts
│   ├── hooks/
│   └── stores/
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   └── models/
└── docs/
```

---

## 8. Git Workflow (Theo rule_git.md)

```
main (production)
  ↑
dev (development)
  ↑
feature/* (mỗi tính năng 1 branch)
```

### Commit Format
- `feat: add hero section component`
- `fix: handle empty description`
- `refactor: improve AI prompt`

---

## 9. Progress Tracking

| Task | Status | Notes |
|------|--------|-------|
| Setup project structure | ✅ Done | Initial structure ready |
| Frontend basic setup | ✅ Done | Vite + React + Tailwind v4 |
| Backend API setup | ✅ Done | FastAPI + OpenAI integration |
| AI generator | ✅ Done | GPT-4o integration |
| Component renderer | ✅ Done | SectionRenderer implemented |
| Live preview | ✅ Done | App.tsx preview mode |
| Export feature | ✅ Done | Export HTML with Tailwind CDN |
| Inline Editor | ✅ Done | ContentEditable sections |
| Theme Customizer | ✅ Done | Color & Font support |
| Template Gallery | ✅ Done | 3 basic templates |
| AI Refinement | ✅ Done | Edit via text prompt |
| Clone URL | ✅ Done | Playwright clone + parse |
| Progress Bar | ✅ Done | Display progress % |
| Gallery Section | ✅ Done | Image gallery |
| Project Storage | ✅ Done | SQLite storage |

---

## 10. Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "shadcn-ui": "latest",
    "zustand": "^4.0.0",
    "dnd-kit": "^6.0.0",
    "zod": "^3.0.0"
  }
}
```

### Backend (requirements.txt)
```txt
fastapi==0.109.0
uvicorn==0.27.0
openai==1.10.0
sqlalchemy==2.0.0
pydantic==2.0.0
python-multipart==0.0.6
```

---

## 11. Todo List

### Ngày 1-2: Setup
- [x] Tạo Next.js project với TypeScript
- [x] Setup Tailwind + shadcn/ui
- [x] Tạo FastAPI backend
- [x] Setup Git branches

### Ngày 3-4: Core AI
- [x] Tạo AI service (OpenAI integration)
- [x] Viết prompt generation
- [x] Tạo JSON schema validator

### Ngày 5-7: Components
- [x] Xây dựng Hero component
- [x] Xây dựng Features component
- [x] Xây dựng CTA component
- [x] Tạo live preview

### Ngày 8-10: Editor
- [x] Tạo input wizard (Cơ bản trong App.tsx)
- [x] Tạo inline editor
- [x] Theme customizer

### Ngày 11-14: Export
- [x] HTML/CSS generator
- [x] Download feature
- [x] Test & Fix bugs

---

**Last Updated:** 2026-04-25