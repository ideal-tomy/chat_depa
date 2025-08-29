import { LogLevel, LogEntry, LoggerConfig } from '@/types';

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(this.config.level);
    const currentLevelIndex = levels.indexOf(level);
    return currentLevelIndex >= configLevelIndex;
  }

  private formatLogEntry(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      formatted += ` | Error: ${error.message}`;
      if (error.stack) {
        formatted += ` | Stack: ${error.stack}`;
      }
    }
    
    return formatted;
  }

  private outputLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formatted = this.formatLogEntry(entry);

    // 本番環境ではconsole.logを無効化
    if (this.config.enableConsole && process.env.NODE_ENV !== 'production') {
      switch (entry.level) {
        case 'debug':
          // eslint-disable-next-line no-console
          console.debug(formatted);
          break;
        case 'info':
          // eslint-disable-next-line no-console
          console.info(formatted);
          break;
        case 'warn':
          // eslint-disable-next-line no-console
          console.warn(formatted);
          break;
        case 'error':
          // eslint-disable-next-line no-console
          console.error(formatted);
          break;
      }
    }

    // 本番環境では構造化ログを出力
    if (process.env.NODE_ENV === 'production') {
      // 本番環境用のログ出力（例：外部ログサービスへの送信）
      this.sendToLogService(entry);
    }
  }

  private sendToLogService(): void {
    // 本番環境でのログ送信処理
    // 例：Sentry、LogRocket、Vercel Analytics等
  }

  private handleErrorLog(entry: LogEntry): void {
    // エラーログの特別処理
    // 例：アラート通知、メトリクス収集等
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', message, context);
    this.outputLog(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, context);
    this.outputLog(entry);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, context);
    this.outputLog(entry);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('error', message, context, error);
    this.outputLog(entry);
  }

  // API用のログメソッド
  apiRequest(method: string, url: string, statusCode?: number, duration?: number): void {
    this.info('API Request', {
      method,
      url,
      statusCode,
      duration: duration ? `${duration}ms` : undefined
    });
  }

  apiError(method: string, url: string, error: Error, statusCode?: number): void {
    this.error('API Error', error, {
      method,
      url,
      statusCode
    });
  }

  // データベース用のログメソッド
  dbQuery(operation: string, table: string, duration?: number): void {
    this.debug('Database Query', {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined
    });
  }

  dbError(operation: string, table: string, error: Error): void {
    this.error('Database Error', error, {
      operation,
      table
    });
  }

  // 認証用のログメソッド
  authEvent(event: string, userId?: string, success?: boolean): void {
    this.info('Authentication Event', {
      event,
      userId,
      success
    });
  }

  authError(event: string, error: Error, userId?: string): void {
    this.error('Authentication Error', error, {
      event,
      userId
    });
  }
}

// 環境別のログ設定
const getLoggerConfig = (): LoggerConfig => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'production':
      return {
        level: 'warn',
        enableConsole: false,
        enableFile: true,
        enableRemote: true
      };
    case 'development':
      return {
        level: 'debug',
        enableConsole: true,
        enableFile: false,
        enableRemote: false
      };
    default:
      return {
        level: 'info',
        enableConsole: true,
        enableFile: false,
        enableRemote: false
      };
  }
};

// グローバルロガーインスタンス
export const logger = new Logger(getLoggerConfig());

// 便利な関数
export const logApiRequest = (method: string, url: string, statusCode?: number, duration?: number) => {
  logger.apiRequest(method, url, statusCode, duration);
};

export const logApiError = (method: string, url: string, error: Error, statusCode?: number) => {
  logger.apiError(method, url, error, statusCode);
};

export const logDbQuery = (operation: string, table: string, duration?: number) => {
  logger.dbQuery(operation, table, duration);
};

export const logDbError = (operation: string, table: string, error: Error) => {
  logger.dbError(operation, table, error);
};

export const logAuthEvent = (event: string, userId?: string, success?: boolean) => {
  logger.authEvent(event, userId, success);
};

export const logAuthError = (event: string, error: Error, userId?: string) => {
  logger.authError(event, error, userId);
};
