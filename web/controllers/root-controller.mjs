import BaseController from "./base-controller.mjs";

class RootController extends BaseController {
  constructor() {
    super("/");
  }

  loadRoutes() {
    this.router.get(this.buildRoute(""), (req, resp, next) => {
      resp.send("Hello");
      next();
    });
  }
}

export default RootController;
