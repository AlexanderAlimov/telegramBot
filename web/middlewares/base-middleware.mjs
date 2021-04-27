class BaseMiddleware {
  constructor(app, index) {
    this.app = app;

    this.index = index !== null ? index : 0;
  }

  getIndex() {
    return this.index;
  }

  handle(req, resp, next) {
    throw new Error(`Please implement this method`);
  }
}

export default BaseMiddleware;
