// import logger from "../web/logger/index.mjs";
import Bot from "db/models/bot.mjs";
import DBProvider from "db/loader.mjs";
import DefaultBot from "./bot/default-bot.mjs";
import scheduler from "./scheduler.js";

const db = new DBProvider(
  "postgres://postgres:postgres@localhost:5432/telegramBotDB"
);

(async () => {
  try {
    await db.connectToDB();
    const bots = await Bot.findAll();
    global.allInstances = {};

    //if there is no bots just returnmyBot
    if (!bots.length) {
      return;
    }

    const obj = await scheduler.start();

    for (let myBot of bots) {
      const token = myBot.token;
      const botWorker = new DefaultBot(token);
      botWorker.start(myBot);
    }
  } catch (err) {
    console.error(err);
  }
})();
