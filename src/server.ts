import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { ProductResolver } from '@resolvers/ProductResolver'; // Import your resolvers
// ... import other necessary modules and resolvers

async function startServer() {
  const app = express();

  // Build TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [ProductResolver], // Add all your resolvers here
    // ... other options
  });

  // Create Apollo Server with the schema
  const server = new ApolloServer({
    schema,
    // ... other Apollo Server options
  });

  await server.start();

  // Apply middleware to the Express app
  server.applyMiddleware({ app });

  // Start the server
  app.listen({ port: 9000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:9000${server.graphqlPath}`
    );
  });
}

startServer();
