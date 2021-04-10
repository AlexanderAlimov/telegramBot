const express = require("express");
const router = express.Router();

const Bot = require("../server/models").Bots;
// const Op = require("../server/models").Sequelize.Op;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("users");
});

router.post("/createBot", async (req, res, next) => {
  try {
    console.log("Bot", Bot);
    if (!req.body.botName) {
      throw Error("should be name");
    }
    if (!req.body.token) {
      throw Error("should be token");
    }
    const bot = {
      token: req.body.token,
      botName: req.body.botName,
    };

    const createdBot = await Bot.create(bot);
    console.log(createdBot);

    res.render("users");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
