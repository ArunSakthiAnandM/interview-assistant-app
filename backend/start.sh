#!/bin/bash

# Interview Organiser Backend - Quick Start Script

echo "================================"
echo "Interview Organiser Backend"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed. Please install Java 17 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Java is installed${NC}"
java -version
echo ""

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Maven is not installed. Please install Maven 3.x.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Maven is installed${NC}"
mvn -version | head -1
echo ""

# Display menu
echo "Please choose an option:"
echo "1) Clean and Compile"
echo "2) Run Tests"
echo "3) Build Package"
echo "4) Run Application"
echo "5) Clean, Build, and Run"
echo "6) Exit"
echo ""
read -p "Enter your choice [1-6]: " choice

case $choice in
    1)
        echo -e "${YELLOW}Cleaning and compiling...${NC}"
        mvn clean compile
        ;;
    2)
        echo -e "${YELLOW}Running tests...${NC}"
        mvn test
        ;;
    3)
        echo -e "${YELLOW}Building package...${NC}"
        mvn clean package
        ;;
    4)
        echo -e "${YELLOW}Starting application...${NC}"
        echo ""
        echo "Application will be available at: http://localhost:8080"
        echo "Health check endpoint: http://localhost:8080/api/v1/health"
        echo ""
        echo "Press Ctrl+C to stop the application"
        echo ""
        mvn spring-boot:run
        ;;
    5)
        echo -e "${YELLOW}Cleaning, building, and running...${NC}"
        mvn clean package -DskipTests
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Build successful${NC}"
            echo ""
            echo "Starting application..."
            echo "Application will be available at: http://localhost:8080"
            echo "Health check endpoint: http://localhost:8080/api/v1/health"
            echo ""
            echo "Press Ctrl+C to stop the application"
            echo ""
            mvn spring-boot:run
        else
            echo -e "${RED}❌ Build failed${NC}"
            exit 1
        fi
        ;;
    6)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

