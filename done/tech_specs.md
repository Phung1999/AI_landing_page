# Tech Specifications - AI Landing Page Generator

## 1. Frontend Tech Stack

### Core
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** shadcn/ui
- **Styling:** Tailwind CSS
- **Package Manager:** npm

### Dependencies
```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.4.0",
  "@types/node": "^20.0.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",

  "shadcn-ui": "latest",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0",

  "zustand": "^4.5.0",
  "zod": "^3.22.0",
  "dnd-kit": "^0.7.0",
  "lucide-react": "^0.400.0",

  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "class-variance-authority": "^0.7.0"
}
```

---

## 2. Backend Tech Stack

### Core
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **ASGI Server:** Uvicorn
- **Package Manager:** pip/poetry

### Dependencies
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
pydantic-settings==2.1.0

openai==1.10.0
sqlalchemy==2.0.25
sqlalchemy-utils==0.41.0
python-multipart==0.0.6

python-dotenv==1.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
aiofiles==23.2.1
httpx==0.26.0
```

---

## 3. Project Directory Structure

```
ai-landing-page-generator/
├── frontend/
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (routes)/
│   │       ├── editor/
│   │       ├── preview/
│   │       └── templates/
│   ├── components/
│   │   ├── ui/              (shadcn components)
│   │   ├── sections/        (landing page sections)
│   │   ├── editor/          (drag-drop, inline-edit)
│   │   └── generator/      (AI form, preview)
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── api.ts
│   │   └── types.ts
│   ├── hooks/
│   ├── stores/              (Zustand stores)
│   └── public/
├── backend/
│   ├── .env.example
│   ├── main.py
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   └── tests/
├── docs/
└── README.md
```

---

## 4. Database Schema (SQLite/SQLAlchemy)

### Tables

```python
# users (future - for auth)
class User(Base):
    __tablename__ = "users"
    id: int
    email: str
    password_hash: str
    created_at: datetime

# projects
class Project(Base):
    __tablename__ = "projects"
    id: int
    user_id: int (nullable for MVP)
    name: str
    type: str  # course, saas, product
    description: str
    sections: str  # JSON string
    theme: str  # JSON string
    created_at: datetime
    updated_at: datetime

# templates
class Template(Base):
    __tablename__ = "templates"
    id: int
    name: str
    type: str
    sections: str  # JSON
    thumbnail: str
    is_premium: bool
```

---

## 5. API Endpoints

### Backend (FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/generate | AI generate from description |
| GET | /api/templates | List all templates |
| GET | /api/templates/{id} | Get single template |
| POST | /api/projects | Save project |
| GET | /api/projects | List user projects |
| GET | /api/projects/{id} | Get project |
| PUT | /api/projects/{id} | Update project |
| DELETE | /api/projects/{id} | Delete project |
| POST | /api/export | Export HTML/CSS |

### Frontend (Next.js API Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/generate | Proxy to backend AI |
| GET | /api/templates | Get templates |
| POST | /api/project | Save project |

---

## 6. Component System

### Section Components

```typescript
// sections/Hero.tsx
interface HeroProps {
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image?: string;
}

// sections/Features.tsx
interface FeaturesProps {
  items: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

// sections/Testimonials.tsx
interface TestimonialsProps {
  items: Array<{
    name: string;
    avatar?: string;
    content: string;
    rating: number;
  }>;
}

// sections/Pricing.tsx
interface PricingProps {
  plans: Array<{
    name: string;
    price: string;
    features: string[];
    cta: string;
    highlight?: boolean;
  }>;
}

// sections/CTA.tsx
interface CTAProps {
  title: string;
  description: string;
  buttonText: string;
}

// sections/Footer.tsx
interface FooterProps {
  links: Array<{
    label: string;
    href: string;
  }>;
  social: Array<{
    platform: string;
    href: string;
  }>;
}
```

---

## 7. Zustand Store

```typescript
// stores/useGeneratorStore.ts
interface GeneratorState {
  // Input
  landingType: 'course' | 'saas' | 'product' | null;
  description: string;

  // Output
  sections: Section[];
  selectedTemplate: string | null;

  // Theme
  theme: {
    primaryColor: string;
    fontFamily: string;
  };

  // UI State
  isGenerating: boolean;
  isPreviewOpen: boolean;

  // Actions
  setLandingType: (type) => void;
  setDescription: (desc) => void;
  generate: () => Promise<void>;
  updateSection: (index, section) => void;
  setTheme: (theme) => void;
  exportHtml: () => Promise<string>;
}
```

---

## 8. AI Prompt Templates

### System Prompt
```python
SYSTEM_PROMPT = """Bạn là một landing page generator chuyên nghiệp.

Nhiệm vụ:
- Tạo landing page chuyển đổi cao
- Phù hợp thị trường Việt Nam
- Hiện đại, tin cậy

Output: JSON theo schema sau:
{
  "sections": [
    {
      "type": "hero",
      "props": { "title": "", "subtitle": "", "cta": "", ... }
    },
    {
      "type": "features",
      "props": { "items": [...] }
    }
  ]
}

Các section hợp lệ: hero, features, testimonials, pricing, cta, footer
"""
```

### User Prompt Template
```python
USER_PROMPT_TEMPLATE = """Loại: {type}
Mô tả: {description}

Tạo landing page theo mô tả trên.
"""
```

---

## 9. Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)
```bash
APP_NAME=ai-landing-page-generator
DEBUG=true
SECRET_KEY=your-secret-key-here

OPENAI_API_KEY=sk-...

DATABASE_URL=sqlite:///./db.sqlite
```

---

## 10. Code Quality Rules

### TypeScript
- strict mode on
- no explicit any
- use interface over type
- export explicit types

### Python
- type hints everywhere
- docstrings for functions
- use pydantic for validation
- lint with ruff

### CSS/Tailwind
- use cn() utility
- follow shadcn conventions
- responsive-first

---

## 11. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | HeroSection.tsx |
| Hooks | camelCase | useGenerator.ts |
| Stores | camelCase | useGeneratorStore.ts |
| Utils | camelCase | cn.ts |
| API Routes | kebab-case | generate-route.ts |
| Python Functions | snake_case | generate_landing_page |
| Python Models | PascalCase | ProjectModel |

---

## 12. Testing Strategy

### Frontend
- Jest + React Testing Library
- Component tests
- Integration tests

### Backend
- Pytest
- Unit tests for services
- Integration tests for routes

---

**Last Updated:** 2026-04-24