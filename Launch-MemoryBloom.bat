@echo off
title MemoryBloom - Gentle Memory Care
echo ========================================================
echo        Starting MemoryBloom App for Windows
echo ========================================================
echo.

cd /d "%~dp0"

set NODE_EXE=
if exist "C:\Users\nithy\AppData\Roaming\Antigravity\bin\agy-node.cmd" (
    set NODE_EXE="C:\Users\nithy\AppData\Roaming\Antigravity\bin\agy-node.cmd"
) else (
    set NODE_EXE=node
)

echo Starting local MemoryBloom server...
start /b "" %NODE_EXE% server.js

timeout /t 2 /nobreak >nul

echo Opening MemoryBloom in standalone app window...
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3000 --window-size=900,920
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3000 --window-size=900,920
) else (
    start http://localhost:3000
)

echo.
echo MemoryBloom is running! Keep this window open while using the app.
echo.
pause
