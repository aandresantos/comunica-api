import { randomUUID } from "crypto";
import pino, { LoggerOptions } from "pino";

export const loggerOpts: LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => ({
      level: label.toUpperCase(),
    }),
  },
  base: { service: "comunica-api" },
  redact: ["password", "pwd"],
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
};
