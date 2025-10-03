@echo off
echo Killing process on port 8082...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8082 ^| findstr LISTENING') do taskkill /PID %%a /F
echo Done.
pause
