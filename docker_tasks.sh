#!/bin/bash

# Function to load development environment variables
load_dev_env() {
    if [ -f .env/development.env ]; then
        set -a  # automatically export all variables
        source .env/development.env
        set +a
        echo "Development environment variables loaded successfully."
    else
        echo ".env/development.env file not found!"
        exit 1
    fi
}

# Function to load production environment variables
load_prod_env() {
    if [ -f .env/production.env ]; then
        set -a  # automatically export all variables
        source .env/production.env
        set +a
        echo "Production environment variables loaded successfully."
    else
        echo ".env/production.env file not found!"
        exit 1
    fi
}

# Pull the latest changes from the Git repository
pull() {
    git pull && echo "Git repository updated successfully."
}

# Start the development environment
dev() {
    load_dev_env
    docker-compose -f docker-compose.yml up --build && echo "Development environment started successfully."
}

# Start the production environment
prod() {
    load_prod_env
    docker-compose -f docker-compose.prod.yml up --build && echo "Production environment started successfully."
}

# Stop the development environment
stop_dev() {
    docker-compose -f docker-compose.yml down && echo "Development environment stopped successfully."
}

# Stop the production environment
stop_prod() {
    docker-compose -f docker-compose.prod.yml down && echo "Production environment stopped successfully."
}

# Clean up the development environment
clean_dev() {
    docker-compose -f docker-compose.yml down --rmi local --volumes --remove-orphans && echo "Development environment cleaned up successfully."
}

# Clean up the production environment
clean_prod() {
    docker-compose -f docker-compose.prod.yml down --rmi local --volumes --remove-orphans && echo "Production environment cleaned up successfully."
}

# Destroy all volumes (Warning: This will delete all data!)
destroy_volumes() {
    docker volume rm $(docker volume ls -q) && echo "All Docker volumes destroyed successfully."
}

# Enhanced clean up for development environment including Docker images
full_clean_dev() {
    echo "Performing full cleanup of development environment..."
    docker-compose -f docker-compose.yml down --rmi all --volumes --remove-orphans
    echo "Full cleanup of development environment completed."
}

# Enhanced clean up for production environment including Docker images
full_clean_prod() {
    echo "Performing full cleanup of production environment..."
    docker-compose -f docker-compose.prod.yml down --rmi all --volumes --remove-orphans
    echo "Full cleanup of production environment completed."
}

# Check the command and call the respective function
case "$1" in
    pull)
        pull
        ;;
    dev)
        dev
        ;;
    prod)
        prod
        ;;
    stop-dev)
        stop_dev
        ;;
    stop-prod)
        stop_prod
        ;;
    clean-dev)
        clean_dev
        ;;
    clean-prod)
        clean_prod
        ;;
    full-clean-dev)
        full_clean_dev
        ;;
    full-clean-prod)
        full_clean_prod
        ;;
    destroy-volumes)
        destroy_volumes
        ;;
    *)
        echo "Usage: $0 {pull|dev|prod|stop-dev|stop-prod|clean-dev|clean-prod|full-clean-dev|full-clean-prod|destroy-volumes}"
        exit 1
esac
