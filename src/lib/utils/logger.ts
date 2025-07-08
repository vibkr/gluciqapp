// Comprehensive logging system for GluciQ
// Supports multiple log levels and environment-based configuration

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
  OFF = 6
}

export interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFileLogging: boolean;
  maxLogEntries: number;
  includeTimestamp: boolean;
  includeStackTrace: boolean;
}

class Logger {
  private config: LogConfig;
  private logEntries: { level: LogLevel; message: string; timestamp: Date; context?: string }[] = [];

  constructor() {
    // Default configuration - can be overridden by environment variables
    this.config = {
      level: this.getLogLevelFromEnv(),
      enableConsole: process.env.EXPO_PUBLIC_ENABLE_CONSOLE_LOGGING !== 'false',
      enableFileLogging: process.env.EXPO_PUBLIC_ENABLE_FILE_LOGGING === 'true',
      maxLogEntries: parseInt(process.env.EXPO_PUBLIC_MAX_LOG_ENTRIES || '1000'),
      includeTimestamp: process.env.EXPO_PUBLIC_INCLUDE_TIMESTAMP !== 'false',
      includeStackTrace: process.env.EXPO_PUBLIC_INCLUDE_STACK_TRACE === 'true',
    };
  }

  private getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.EXPO_PUBLIC_LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'TRACE': return LogLevel.TRACE;
      case 'DEBUG': return LogLevel.DEBUG;
      case 'INFO': return LogLevel.INFO;
      case 'WARN': return LogLevel.WARN;
      case 'ERROR': return LogLevel.ERROR;
      case 'FATAL': return LogLevel.FATAL;
      case 'OFF': return LogLevel.OFF;
      default: return __DEV__ ? LogLevel.DEBUG : LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level && this.config.level !== LogLevel.OFF;
  }

  private formatMessage(level: LogLevel, message: string, context?: string, error?: Error): string {
    const levelStr = LogLevel[level];
    const timestamp = this.config.includeTimestamp ? new Date().toISOString() : '';
    const contextStr = context ? `[${context}]` : '';
    const timestampStr = timestamp ? `${timestamp} ` : '';
    
    let formattedMessage = `${timestampStr}${levelStr} ${contextStr} ${message}`;
    
    if (error && this.config.includeStackTrace) {
      formattedMessage += `\nStack: ${error.stack}`;
    }
    
    return formattedMessage;
  }

  private log(level: LogLevel, message: string, context?: string, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context, error);
    
    // Console logging
    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.TRACE:
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage);
          break;
      }
    }

    // Store log entry for file logging or debugging
    if (this.config.enableFileLogging) {
      this.logEntries.push({
        level,
        message: formattedMessage,
        timestamp: new Date(),
        context
      });

      // Maintain max entries limit
      if (this.logEntries.length > this.config.maxLogEntries) {
        this.logEntries = this.logEntries.slice(-this.config.maxLogEntries);
      }
    }
  }

  // Public logging methods
  trace(message: string, context?: string): void {
    this.log(LogLevel.TRACE, message, context);
  }

  debug(message: string, context?: string): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: string): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: string, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: string, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, context?: string, error?: Error): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  // Utility methods
  updateConfig(newConfig: Partial<LogConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getLogEntries(): { level: LogLevel; message: string; timestamp: Date; context?: string }[] {
    return [...this.logEntries];
  }

  clearLogs(): void {
    this.logEntries = [];
  }

  // Context-specific loggers
  createContextLogger(context: string) {
    return {
      trace: (message: string) => this.trace(message, context),
      debug: (message: string) => this.debug(message, context),
      info: (message: string) => this.info(message, context),
      warn: (message: string, error?: Error) => this.warn(message, context, error),
      error: (message: string, error?: Error) => this.error(message, context, error),
      fatal: (message: string, error?: Error) => this.fatal(message, context, error),
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export context-specific loggers for different modules
export const userLogger = logger.createContextLogger('USER');
export const onboardingLogger = logger.createContextLogger('ONBOARDING');
export const databaseLogger = logger.createContextLogger('DATABASE');
export const authLogger = logger.createContextLogger('AUTH');
export const apiLogger = logger.createContextLogger('API');
export const uiLogger = logger.createContextLogger('UI');

// Default export
export default logger; 