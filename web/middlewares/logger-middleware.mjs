import logger from "logger/index.mjs";
import BaseMiddleware from "./base-middleware.mjs";

class LoggerMiddleware extends BaseMiddleware {
  constructor(app) {
    super(app, 0);
  }

  handle(req, res, next) {
    logger.debug(`Request to ${req.url}`);

    next();
  }
}

export default LoggerMiddleware;
