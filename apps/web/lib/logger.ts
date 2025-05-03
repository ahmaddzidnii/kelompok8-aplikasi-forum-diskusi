import winston from "winston";

const { transports, format } = winston;
const { combine, colorize, timestamp, printf } = format;

import { config } from "@/config";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  levels,
  level: config.logLevel,
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        myFormat,
      ),
    }),
    // new transports.File({
    //   filename: ".logs/error.log",
    //   level: "error",
    //   format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
    // }),
  ],
});

export default logger;
