// File: src/config/env.ts

import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Determine which .env file to load
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

// Check if the file exists
if (fs.existsSync(path.resolve(envFile))) {
  dotenv.config({ path: envFile });
} else {
  console.warn(`.env file ${envFile} not found, loading defaults`);
  dotenv.config();
}

interface Env {
  MONGO_URI: string;
  // Add other environment variables as needed
}

const env: Env = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://defaultUri/mydatabase',
  // Default values or additional variables
};

export default env;
