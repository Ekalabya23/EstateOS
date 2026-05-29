/**
 * Winston Logger Configuration
 *
 * Provides a centralized logger with console and file transports.
 * - Development: debug level, colorized console output
 * - Production: info level, JSON formatted file output
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log directory (server/logs/)
const LOG_DIR = path.resolve(__dirname, '../../logs');

// Determine environment
const isDev = process.env.NODE_ENV !== 'production';

/**
 * Custom log format for console output in development.
 * Colorized with timestamp and level padding.
 */
const devConsoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${stack || message}${metaStr}`;
  })
);

/**
 * Structured JSON format for production log files.
 */
const prodFileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Winston logger instance.
 */
const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  defaultMeta: { service: 'estateos-api' },
  transports: [
    // ─── Console Transport ───────────────────────────────────────────────
    new winston.transports.Console({
      format: isDev ? devConsoleFormat : prodFileFormat,
    }),

    // ─── Error Log File ──────────────────────────────────────────────────
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
      format: prodFileFormat,
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
    }),

    // ─── Combined Log File ──────────────────────────────────────────────
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      format: prodFileFormat,
      maxsize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 5,
    }),
  ],

  // Do not exit on unhandled errors
  exitOnError: false,
});

export default logger;
