// File: src/config/database.ts

import mongoose from 'mongoose';
import env from './env';
import { log } from '@/utils/logger/log';

log.debug('MONGO_URI: ', env.MONGO_URI);

mongoose.connect(env.MONGO_URI);

mongoose.connection.on('open', () => {
  log.info('Successfully connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  log.error(`Error connecting to MongoDB: ${err}`);
  log.debug('MONGO_URI ERROR: ', env.MONGO_URI);
});

export default mongoose;
