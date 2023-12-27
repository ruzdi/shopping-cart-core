import * as winston from 'winston';
import { v4 as generateCorrelationId } from 'uuid';

const env = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || 'info';

interface LogFormat {
  level: string;
  message: string;
  label?: string;
  timestamp: string;
  correlationId?: string;
}

const customFormat = winston.format.printf((info) => {
  const { level, message, label, timestamp, correlationId } = info as LogFormat;

  let formattedMessage = `${timestamp} [${level}]`;

  if (label) {
    formattedMessage += ` [${label}]`;
  }

  if (correlationId) {
    formattedMessage += ` | Correlation ID: ${correlationId}`;
  }

  // Adding the message at the end
  formattedMessage += `: ${message}`;

  return formattedMessage;
});

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.label({ label: 'ShoppingCartApp' }),
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    // Add other transports for cloud logging as needed
  ],
});

if (env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const loggerWrapper = (
  level: string,
  message: string,
  correlationId?: string
) => {
  const formattedMessage = `CorrelationID: ${
    correlationId || generateCorrelationId()
  } | ${message}`;
  logger.log(level, formattedMessage);
};

const log = {
  debug: (message: string, correlationId?: string) =>
    loggerWrapper('debug', message, correlationId),
  info: (message: string, correlationId?: string) =>
    loggerWrapper('info', message, correlationId),
  error: (message: string, correlationId?: string) =>
    loggerWrapper('error', message, correlationId),
};

export { log, generateCorrelationId };
