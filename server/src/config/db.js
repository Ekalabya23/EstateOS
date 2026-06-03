import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    logger.warn('Server is running without a database connection. Auth routes will fail.');
  }
};
