@echo off
echo Starting Lazreus Tech Website...
echo.

REM Start the authentication server
start /min cmd /c "node server/index.js"

REM Start the HTML server
start /min cmd /c "node html-server.js"

REM Start the OTP display server
start /min cmd /c "node otp-display.js"

REM Wait for the servers to start
timeout /t 2 /nobreak > nul

REM Open the website in the default browser
start http://localhost:3000

REM Open the OTP display page
start http://localhost:5001

echo Website started successfully!
echo.
echo Press any key to exit...
pause > nul
