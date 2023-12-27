# Shopping Cart Core

This project provides a containerized shopping cart application with a convenient Makefile for Docker container management and a docker_tasks.sh script for additional utility commands.

## Features

- **Node.js Backend**: Leverages Node.js for a fast and scalable server environment.
- **MongoDB Integration**: Utilizes MongoDB for robust data storage and retrieval.
- **GraphQL API**: Provides a flexible and efficient GraphQL interface for data queries.

## Makefile Usage

The Makefile simplifies the process of building and managing Docker containers for the application. Here's how you can use it:

- `make dev`: Starts the development environment.
- `make prod`: Starts the production environment.
- `make stop-dev`: Stops the development environment.
- `make stop-prod`: Stops the production environment.
- `make clean-dev`: Cleans up the development environment.
- `make clean-prod`: Cleans up the production environment.
- `make full-clean-dev`: Fully cleans the development environment including removing all images and volumes.
- `make full-clean-prod`: Fully cleans the production environment including removing all images and volumes.

## Docker Tasks Script Usage

The `docker_tasks.sh` script provides utility commands for managing Docker containers and images. Here's how you can use it:

- `./docker_tasks.sh dev`: Starts the development environment using Docker.
- `./docker_tasks.sh prod`: Starts the production environment using Docker.
- `./docker_tasks.sh stop-dev`: Stops the development environment.
- `./docker_tasks.sh stop-prod`: Stops the production environment.
- `./docker_tasks.sh clean-dev`: Cleans up the development environment, including removing all images and volumes.
- `./docker_tasks.sh clean-prod`: Cleans up the production environment, including removing all images and volumes.

## Getting Started

To get started with the project, clone the repository and navigate to the directory. Use the Makefile or docker_tasks.sh script to manage your Docker containers.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit your pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Questions or Feedback

Feel free to [open an issue](https://github.com/ruzdi/shopping-cart-core/issues/new) on GitHub for any questions, suggestions, or feedback.

## Acknowledgements

(TODO: Acknowledge any significant contributions, inspirations, or third-party resources used in the project.)

---

Happy Coding!
