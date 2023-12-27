# Makefile for managing Docker Compose tasks and Git operations

# Function to load development environment variables
load-dev-env:
	@if [ -f .env/development.env ]; then \
		set -a; \
		source .env/development.env; \
		set +a; \
	else \
		echo ".env/development.env file not found!"; \
		exit 1; \
	fi

# Function to load production environment variables
load-prod-env:
	@if [ -f .env/production.env ]; then \
		set -a; \
		source .env/production.env; \
		set +a; \
	else \
		echo ".env/production.env file not found!"; \
		exit 1; \
	fi

# Pull the latest changes from the Git repository
pull:
	git pull

# Start the development environment
dev: load-dev-env
	docker-compose -f docker-compose.yml up --build

# Start the production environment
prod: load-prod-env
	docker-compose -f docker-compose.prod.yml up --build

# Stop the development environment
stop-dev:
	docker-compose -f docker-compose.yml down

# Stop the production environment
stop-prod:
	docker-compose -f docker-compose.prod.yml down

# Clean up the development environment
clean-dev:
	docker-compose -f docker-compose.yml down --rmi local --volumes --remove-orphans

# Clean up the production environment
clean-prod:
	docker-compose -f docker-compose.prod.yml down --rmi local --volumes --remove-orphans

# Full clean up the development environment (including removing all images and volumes)
full_clean_dev:
	docker-compose -f docker-compose.yml down --rmi all --volumes --remove-orphans

# Full clean up the production environment (including removing all images and volumes)
full_clean_prod:
	docker-compose -f docker-compose.prod.yml down --rmi all --volumes --remove-orphans

# Destroy all volumes (Warning: This will delete all data!)
destroy-volumes:
	docker volume rm $(docker volume ls -q)

.PHONY: load-dev-env load-prod-env pull dev prod stop-dev stop-prod clean-dev clean-prod full_clean_dev full_clean_prod destroy-volumes