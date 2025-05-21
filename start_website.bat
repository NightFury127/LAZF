@echo off
echo Starting Lazreus Tech Website...
echo.

REM Start the server for email authentication
start /min cmd /c "node server/server.js"

REM Wait for the server to start
timeout /t 2 /nobreak > nul

REM Open the default page in the default browser
start default.html

echo Website started successfully!
echo.
echo Press any key to exit...
pause > nul
