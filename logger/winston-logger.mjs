import winston from "winston";
import Logger from "./logger.mjs";

class WinstonLogger extends Logger {
  constructor() {
    super();

    this.logger = winston.createLogger({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ level: true }),
        winston.format.timestamp(),
        winston.format.printf((message) => {
          return `${message.timestamp} [${message.level}] ${message.message}`;
        })
      ),
      transports: [new winston.transports.Console()],
    });
  }

  info(message) {
    this.logger.info(message);
  }

  debug(message) {
    this.logger.debug(message);
  }

  error(message) {
    this.logger.error(message);
  }

  verbose(message) {
    this.logger.verbose(message);
  }
}

export default WinstonLogger;
