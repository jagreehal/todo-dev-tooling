/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Sentry from '@sentry/node';
import { Options as SentryOptions } from '@sentry/types';
import { debug as debugModule } from 'debug';
import pino, { Logger as PinoLogger, LoggerOptions as PinoOptions } from 'pino';

type LoggerConfig = {
  sentry?: SentryOptions;
  pino?: PinoOptions;
};

export const debugLog = debugModule('todo-app');
let pinoLogger: PinoLogger | null = pino();
let isSentryInitialized = false;

export function init(config: LoggerConfig = {}) {
  if (config.pino) {
    pinoLogger = pino(config.pino);
  }

  if (config.sentry && !isSentryInitialized) {
    Sentry.init(config.sentry);
    isSentryInitialized = true;
  } else {
    isSentryInitialized = false;
  }
}

export function info(message: string, ...data: any[]) {
  debugLog('INFO: ' + message, ...data);
  pinoLogger?.info(message, ...data);
}

export function warn(message: string, ...data: any[]) {
  debugLog('WARN: ' + message, ...data);
  pinoLogger?.warn(message, ...data);
}

export function debug(message: string, ...data: any[]) {
  debugLog('DEBUG: ' + message, ...data);
  pinoLogger?.debug(message, ...data);
}

export function error(message: string, error: Error, ...data: any[]) {
  debugLog('ERROR: ' + message, error, ...data);
  pinoLogger?.error(message, error, ...data);

  if (isSentryInitialized) {
    Sentry.captureException(error);
  }
}

export function getPinoLogger() {
  if (pinoLogger) {
    return pinoLogger;
  }
  console.warn('Pino is not initialized.');
  return;
}

export function getSentry() {
  if (isSentryInitialized) {
    return Sentry;
  }
  console.warn('Sentry is not initialized.');
  return;
}
