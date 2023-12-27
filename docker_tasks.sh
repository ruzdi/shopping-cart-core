#!/bin/bash

# Function to load development environment variables
load_dev_env() {
    if [ -f .env/development.env ]; then
        set -a  # automatically export all variables
        source .env/development.env
        set +a
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
    else
        echo ".env/production.env file not found!"
        exit 1
    fi
}

# Pull the latest changes from the Git repository
pull() {
    git pull
}

# Start the development environment
dev() {
    load_dev_env
    docker-compose -f docker-compose.yml up --build
}

# Start the production environment
prod() {
    load_prod_env
    docker-compose -f docker-compose.prod.yml up --build
}

# Stop the development environment
stop_dev() {
    docker-compose -f docker-compose.yml down
}

# Stop the production environment
stop_prod() {
    docker-compose -f docker-compose.prod.yml down
}

# Clean up the development environment
clean_dev() {
    docker-compose -f docker-compose.yml down --rmi local --volumes --remove-orphans
}

# Clean up the production environment
clean_prod() {
    docker-compose -f docker-compose.prod.yml down --rmi local --volumes --remove-orphans
}

# Destroy all volumes (Warning: This will delete all data!)
destroy_volumes() {
    docker volume rm $(docker volume ls -q)
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
