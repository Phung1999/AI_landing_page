@echo off
echo ==========================================
echo   AI Landing Page Generator - Starter
echo ==========================================

echo Dang khoi dong Backend (FastAPI)...
start cmd /k "cd /d %~dp0backend && uvicorn main:app --reload --port 8000"

echo Dang khoi dong Frontend (Vite)...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo ==========================================
echo   Backend: http://localhost:8000
echo   Frontend: http://localhost:5173
echo ==========================================
pause