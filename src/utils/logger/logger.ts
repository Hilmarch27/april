import { Csl } from "../json.pretty";

// Augment the global Console interface to include new methods
declare global {
  interface Console {
    success(...args: any[]): void;
    verbose(...args: any[]): void;
  }
}

// Define log levels
export type LogLevel =
  | "info"
  | "success"
  | "warn"
  | "error"
  | "debug"
  | "verbose";

// Configuration interface
interface LoggerConfig {
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
 * Advanced Logger with flexible configuration
 */
class Logger {
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

  private constructor() {
    // Detect environment, default to development
    this.currentEnv = process.env.NODE_ENV || "development";
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
    this.currentEnv = env;
    return this;
  }

  /**
   * Check if a log level is enabled
   */
  private isLevelEnabled(level: LogLevel): boolean {
    // Check environment-specific config first
    const envConfig = this.config.environments?.[this.currentEnv];

    // If environment is disabled, return false
    if (envConfig?.disabled) return false;

    // Priority to environment-specific levels
    const enabledLevels = envConfig?.enabledLevels || this.config.enabledLevels;

    return enabledLevels?.includes(level) || false;
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    color: keyof (typeof Csl)["nodeColors"],
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
    color: keyof (typeof Csl)["nodeColors"],
    ...args: any[]
  ): void {
    Csl.log(color, ...args);
  }
}

// Global logger instance
export const logger = Logger.getInstance();

// Optionally extend console (can be disabled if needed)
if (typeof console !== "undefined") {
  console.info = (...args: any[]) => logger.info(...args);
  console.success = (...args: any[]) => logger.success(...args);
  console.warn = (...args: any[]) => logger.warn(...args);
  console.error = (...args: any[]) => logger.error(...args);
  console.debug = (...args: any[]) => logger.debug(...args);
  console.verbose = (...args: any[]) => logger.verbose(...args);
}
