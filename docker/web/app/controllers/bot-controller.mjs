import BaseController from "./base-controller.mjs";
import Bot from "db/models/bot.mjs";

class BotController extends BaseController {
  constructor() {
    super("/bot");
  }
  loadRoutes() {
    this.router.post(this.buildRoute("/"), async (req, res, next) => {
      try {
        const botData = await Bot.create({
          botName: req.body.botName,
          token: req.body.token,
          password: req.body.password,
        });
        res.json(botData);
      } catch (e) {
        res.send(e);
      }
    });
  }
}

export default BotController;
