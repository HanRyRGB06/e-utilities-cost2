@echo off
REM Quick Start Script for e-utilities-cost Project
REM For Windows users

echo.
echo ===================================
echo e-utilities-cost Quick Start
echo ===================================
echo.

REM Check if docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not installed
    echo Please ensure Docker Desktop is properly installed
    pause
    exit /b 1
)

echo ✓ Docker and Docker Compose found
echo.

REM Menu
:menu
echo.
echo Choose an option:
echo 1. Start all services (docker-compose up -d --build)
echo 2. Stop all services (docker-compose down)
echo 3. View services status (docker-compose ps)
echo 4. View logs (docker-compose logs -f)
echo 5. View backend logs
echo 6. View frontend logs
echo 7. Restart services
echo 8. Open frontend in browser
echo 9. Exit
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto status
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto backend_logs
if "%choice%"=="6" goto frontend_logs
if "%choice%"=="7" goto restart
if "%choice%"=="8" goto open_browser
if "%choice%"=="9" goto end

echo Invalid choice. Please try again.
goto menu

:start
echo.
echo Starting all services...
docker-compose up -d --build
echo.
echo ✓ Services started!
echo.
echo Access URLs:
echo   Frontend:   http://localhost:8080
echo   Backend:    http://localhost:3000/api
echo   phpMyAdmin: http://localhost:8081
echo   Nginx:      http://localhost
echo.
pause
goto menu

:stop
echo.
echo Stopping all services...
docker-compose down
echo ✓ Services stopped!
echo.
pause
goto menu

:status
echo.
docker-compose ps
echo.
pause
goto menu

:logs
echo.
echo Showing all logs (Press Ctrl+C to exit)...
docker-compose logs -f
goto menu

:backend_logs
echo.
echo Showing backend logs (Press Ctrl+C to exit)...
docker-compose logs -f backend
goto menu

:frontend_logs
echo.
echo Showing frontend logs (Press Ctrl+C to exit)...
docker-compose logs -f frontend
goto menu

:restart
echo.
echo Restarting services...
docker-compose restart
echo ✓ Services restarted!
echo.
pause
goto menu

:open_browser
echo.
echo Opening frontend in browser...
start http://localhost:8080
pause
goto menu

:end
echo.
echo Goodbye!
exit /b 0
