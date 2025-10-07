#!/bin/bash

echo "Starting Spring Boot Task Manager Backend..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Maven is not installed. Please install Maven first."
    exit 1
fi

# Navigate to the project directory
cd "$(dirname "$0")"

# Compile and run the Spring Boot application
mvn spring-boot:run