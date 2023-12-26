// File: src/config/database.ts

import mongoose from 'mongoose';
import env from './env';

mongoose.connect(env.MONGO_URI);

mongoose.connection.on('open', () => {
  console.log('Successfully connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Error connecting to MongoDB: ${err}`);
});

export default mongoose;