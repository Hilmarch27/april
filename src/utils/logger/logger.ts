import { Csl } from "../json.pretty";

// Define log levels
export type LogLevel =
  | "info"
  | "success"
  | "warn"
  | "error"
  | "debug"
  | "verbose";

// Configuration interface
export interface LoggerConfig {
  /**
   * Global log levels to enable
   */
  enabledLevels?: LogLevel[];

  /**
   * Environment-specific configurations
   */
  environments?: {
    [env: string]: {
      enabledLevels?: LogLevel[];
      disabled?: boolean;
    };
  };

  /**
   * Custom logging transformer
   */
  transformer?: (level: LogLevel, ...args: any[]) => any[];
}

/**
 * Enhanced Console interface with optional methods
 */
export interface EnhancedConsole extends Console {
  success?: (...args: any[]) => void;
  verbose?: (...args: any[]) => void;
}

/**
 * Advanced Logger with flexible configuration
 */
export class Logger {
  // Singleton instance
  private static instance: Logger;

  // Configuration storage
  private config: LoggerConfig = {
    enabledLevels: ["info", "success", "warn", "error", "debug", "verbose"],
    environments: {
      production: {
        enabledLevels: ["error", "warn"],
      },
      development: {
        enabledLevels: ["info", "success", "warn", "error", "debug", "verbose"],
      },
    },
  };

  // Current environment
  private currentEnv: string;

  // Log queue for handling logs before environment is fully set
  private logQueue: Array<{
    level: LogLevel;
    color: any;
    args: any[];
  }> = [];

  private constructor() {
    // Detect environment, default to development
    this.currentEnv = this.detectEnvironment();
  }

  /**
   * Detect current environment
   */
  private detectEnvironment(): string {
    // Check various environment variables
    const env =
      process.env.NODE_ENV ||
      process.env.ENVIRONMENT ||
      process.env.ENV ||
      "development";
    return env.toLowerCase();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Configure logger globally
   */
  public configure(config: LoggerConfig): Logger {
    this.config = {
      ...this.config,
      ...config,
      environments: {
        ...this.config.environments,
        ...config.environments,
      },
    };
    return this;
  }

  /**
   * Set current environment
   */
  public setEnvironment(env: string): Logger {
    // Normalize environment string
    this.currentEnv = env.toLowerCase();

    // Process any queued logs with new environment settings
    this.processLogQueue();

    return this;
  }

  /**
   * Get current environment
   */
  public getEnvironment(): string {
    return this.currentEnv;
  }

  /**
   * Check if a log level is enabled
   */
  private isLevelEnabled(level: LogLevel): boolean {
    // Ensure environment is set
    if (!this.currentEnv) {
      this.currentEnv = this.detectEnvironment();
    }

    // Check environment-specific config first
    const envConfig = this.config.environments?.[this.currentEnv];

    // If environment is disabled, return false
    if (envConfig?.disabled) return false;

    // Priority to environment-specific levels
    const enabledLevels = envConfig?.enabledLevels || this.config.enabledLevels;

    return enabledLevels?.includes(level) || false;
  }

  /**
   * Process log queue after environment change
   */
  private processLogQueue(): void {
    while (this.logQueue.length > 0) {
      const logEntry = this.logQueue.shift();
      if (logEntry) {
        this.log(logEntry.level, logEntry.color, ...logEntry.args);
      }
    }
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    color: any,
    ...args: any[]
  ): void {
    // Check if logging is enabled for this level
    if (!this.isLevelEnabled(level)) return;

    // Apply optional transformer
    const transformedArgs = this.config.transformer
      ? this.config.transformer(level, ...args)
      : args;

    // Log with color
    Csl.log(color, ...transformedArgs);
  }

  /**
   * Logging methods
   */
  public info(...args: any[]): void {
    this.log("info", "blue", ...args);
  }

  public success(...args: any[]): void {
    this.log("success", "green", ...args);
  }

  public warn(...args: any[]): void {
    this.log("warn", "yellow", ...args);
  }

  public error(...args: any[]): void {
    this.log("error", "red", ...args);
  }

  public debug(...args: any[]): void {
    this.log("debug", "cyan", ...args);
  }

  public verbose(...args: any[]): void {
    this.log("verbose", "gray", ...args);
  }

  /**
   * Custom color logging
   */
  public customLog(
    color: any,
    ...args: any[]
  ): void {
    Csl.log(color, ...args);
  }

  /**
   * Extend console with logger methods
   */
  public extendConsole(consoleObj: EnhancedConsole = console): void {
    consoleObj.info = (...args: any[]) => this.info(...args);
    consoleObj.success = (...args: any[]) => this.success(...args);
    consoleObj.warn = (...args: any[]) => this.warn(...args);
    consoleObj.error = (...args: any[]) => this.error(...args);
    consoleObj.debug = (...args: any[]) => this.debug(...args);
    consoleObj.verbose = (...args: any[]) => this.verbose(...args);
  }
}

// Explicitly typed logger instance
export const logger: Logger = Logger.getInstance();

// Optional console extension (now a method call instead of global augmentation)
if (typeof console !== "undefined") {
  logger.extendConsole();
}
