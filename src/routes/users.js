const express = require("express");
const router = express.Router();

const Bot = require("../server/models").Bots;
// const Op = require("../server/models").Sequelize.Op;

router.post("/createBot", async (req, res, next) => {
  try {
    console.log("Bot", Bot);
    if (!req.body.botName) {
      throw Error("should be name");
    }
    if (!req.body.token) {
      throw Error("should be token");
    }

    const checkIfBotExist = await Bot.findAndCountAll({
      where: { token: req.body.token },
    });
    if (checkIfBotExist.count) {
      throw Error("token alredy exist please set another one");
    }

    const bot = {
      token: req.body.token,
      botName: req.body.botName,
    };

    const createdBot = await Bot.create(bot);
    console.log(createdBot);

    res.json({ status: "200" });
  } catch (err) {
    console.log(err);
    res.json({ err: err.message });
  }
});

module.exports = router;
