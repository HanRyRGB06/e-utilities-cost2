#!/bin/bash

# Quick Start Script for e-utilities-cost Project
# For Mac and Linux users

clear

echo "==================================="
echo "  e-utilities-cost Quick Start"
echo "==================================="
echo ""

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ ERROR: Docker is not installed"
    echo "Please install Docker from https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ ERROR: Docker Compose is not installed"
    echo "Please ensure Docker is properly installed"
    exit 1
fi

echo "✓ Docker and Docker Compose found"
echo ""

# Menu function
show_menu() {
    echo ""
    echo "Choose an option:"
    echo "1. Start all services (up -d --build)"
    echo "2. Stop all services (down)"
    echo "3. View services status (ps)"
    echo "4. View all logs"
    echo "5. View backend logs"
    echo "6. View frontend logs"
    echo "7. Restart services"
    echo "8. Execute command in backend"
    echo "9. Access MySQL shell"
    echo "10. Open frontend in browser"
    echo "0. Exit"
    echo ""
    read -p "Enter your choice (0-10): " choice
}

# Handle choices
while true; do
    show_menu
    
    case $choice in
        1)
            echo ""
            echo "Starting all services..."
            docker-compose up -d --build
            echo ""
            echo "✓ Services started!"
            echo ""
            echo "Access URLs:"
            echo "  Frontend:   http://localhost:8080"
            echo "  Backend:    http://localhost:3000/api"
            echo "  phpMyAdmin: http://localhost:8081"
            echo "  Nginx:      http://localhost"
            echo ""
            read -p "Press Enter to continue..."
            ;;
        2)
            echo ""
            echo "Stopping all services..."
            docker-compose down
            echo "✓ Services stopped!"
            echo ""
            read -p "Press Enter to continue..."
            ;;
        3)
            echo ""
            docker-compose ps
            echo ""
            read -p "Press Enter to continue..."
            ;;
        4)
            echo ""
            echo "Showing all logs (Press Ctrl+C to exit)..."
            docker-compose logs -f
            ;;
        5)
            echo ""
            echo "Showing backend logs (Press Ctrl+C to exit)..."
            docker-compose logs -f backend
            ;;
        6)
            echo ""
            echo "Showing frontend logs (Press Ctrl+C to exit)..."
            docker-compose logs -f frontend
            ;;
        7)
            echo ""
            echo "Restarting services..."
            docker-compose restart
            echo "✓ Services restarted!"
            echo ""
            read -p "Press Enter to continue..."
            ;;
        8)
            echo ""
            read -p "Enter command to run in backend (e.g., npm run dev): " cmd
            docker-compose exec backend $cmd
            echo ""
            read -p "Press Enter to continue..."
            ;;
        9)
            echo ""
            echo "Connecting to MySQL..."
            docker-compose exec mariadb mysql -u app_user -pchangeme e_utilities_cost
            ;;
        10)
            echo ""
            echo "Opening frontend in browser..."
            if command -v xdg-open &> /dev/null; then
                xdg-open http://localhost:8080  # Linux
            elif command -v open &> /dev/null; then
                open http://localhost:8080      # macOS
            else
                echo "Please open http://localhost:8080 in your browser"
            fi
            read -p "Press Enter to continue..."
            ;;
        0)
            echo ""
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
done
