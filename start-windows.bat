@echo off
cd /d "%~dp0"
where node >nul 2>nul && node build-images.js
echo Serving on http://localhost:5500  --  press Ctrl+C to stop
start "" http://localhost:5500
python -m http.server 5500
