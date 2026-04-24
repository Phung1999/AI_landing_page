@echo off
echo ==========================================
echo   AI Landing Page Generator - Starter
echo ==========================================

:: Bat dau Backend
echo Dang khoi dong Backend (FastAPI)...
start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

:: Bat dau Frontend
echo Dang khoi dong Frontend (Vite)...
start cmd /k "cd frontend && npm install && npm run dev"

echo ==========================================
echo   Backend: http://localhost:8000
echo   Frontend: http://localhost:5173
echo ==========================================
pause
