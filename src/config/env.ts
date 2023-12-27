// File: src/config/env.ts

import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Determine which .env file to load
const envFile = `.env/.env.${process.env.NODE_ENV || 'development'}`;

// Check if the file exists
if (fs.existsSync(path.resolve(envFile))) {
  dotenv.config({ path: envFile });
} else {
  console.warn(`.env file ${envFile} not found, loading defaults`);
  dotenv.config();
}

interface Env {
  MONGO_URI: string;
  MONGO_DB_HOST: string;
  MONGO_DB_NAME: string;
  MONGO_DB_USER: string;
  MONGO_DB_PASSWORD: string;
  MONGO_DB_PORT: string;
}

const {
  MONGO_DB_ROOT_USERNAME: MONGO_DB_USER = '',
  MONGO_DB_ROOT_PASSWORD: MONGO_DB_PASSWORD = '',
  MONGO_DB_HOST = '',
  MONGO_DB_PORT = '',
  MONGO_DB_NAME = '',
} = process.env;

if (MONGO_DB_USER && MONGO_DB_PASSWORD) {
}

const MONGO_URI =
  MONGO_DB_USER && MONGO_DB_PASSWORD
    ? `mongodb://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`
    : `mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`;

const env: Env = {
  MONGO_URI,
  MONGO_DB_HOST,
  MONGO_DB_PORT,
  MONGO_DB_NAME,
  MONGO_DB_USER: MONGO_DB_USER,
  MONGO_DB_PASSWORD: encodeURIComponent(MONGO_DB_PASSWORD),
};

export default env;
