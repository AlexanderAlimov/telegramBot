import express from "express";

class BaseController {
  constructor(prefix) {
    this.router = express.Router();
    this.prefix = prefix;
  }

  buildRoute(path) {
    return this.prefix + path;
  }

  getPath() {
    return this.prefix;
  }

  loadRoutes() {
    throw new Error("Please implement this method for handle https requests");
  }

  getRouter() {
    return this.router;
  }
}

export default BaseController;
