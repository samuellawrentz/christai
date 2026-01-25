type LogLevel = "debug" | "info" | "warn" | "error";

const COLORS = {
  debug: "\x1b[36m", // cyan
  info: "\x1b[32m", // green
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
  reset: "\x1b[0m",
};

const formatTimestamp = () => new Date().toISOString();

const formatMessage = (level: LogLevel, context: string, message: string, meta?: object) => {
  const color = COLORS[level];
  const timestamp = formatTimestamp();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  return `${color}[${timestamp}] [${level.toUpperCase()}] [${context}]${COLORS.reset} ${message}${metaStr}`;
};

export const createLogger = (context: string) => ({
  debug: (message: string, meta?: object) => {
    if (process.env.LOG_LEVEL === "debug") {
      console.log(formatMessage("debug", context, message, meta));
    }
  },
  info: (message: string, meta?: object) => {
    console.log(formatMessage("info", context, message, meta));
  },
  warn: (message: string, meta?: object) => {
    console.warn(formatMessage("warn", context, message, meta));
  },
  error: (message: string, meta?: object) => {
    console.error(formatMessage("error", context, message, meta));
  },
});

// Pre-configured loggers for common contexts
export const log = {
  api: createLogger("API"),
  chat: createLogger("Chat"),
  tools: createLogger("Tools"),
  auth: createLogger("Auth"),
  db: createLogger("DB"),
};
