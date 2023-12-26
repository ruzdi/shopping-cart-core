# Shopping-Cart-Core

## Overview
`shopping-cart-core` is a backend application framework for building a shopping cart system. It integrates Node.js, MongoDB, and GraphQL, offering a robust and efficient setup for e-commerce applications.

## Features
- **Node.js Backend**: Leverages Node.js for a fast and scalable server environment.
- **MongoDB Integration**: Utilizes MongoDB for robust data storage and retrieval.
- **GraphQL API**: Provides a flexible and efficient GraphQL interface for data queries.

## Getting Started

### Prerequisites
Before starting, ensure you have the following installed on your system:
- [Docker](https://www.docker.com/get-started): To run MongoDB in a container.
- [Node.js](https://nodejs.org/en/): As the runtime environment for the application.
- [Yarn](https://yarnpkg.com/): For package management.

### Setup MongoDB with Docker

1. **Pull the MongoDB Image**:  
   Download the MongoDB Docker image:
   ```bash
   docker pull mongo
2. **Run MongoDB Container**:  
   Start a MongoDB container with the following command:
   ```bash
   docker run --name mongodb -p 27017:27017 -d mongo

### Setup and Run Backend Application

1. **Install Dependencies**:  
   Install the required Node.js packages using Yarn:
   ```bash
   yarn install
2. **Start the Development Server**:  
   Launch the backend application in development mode:
   ```bash
   yarn dev
