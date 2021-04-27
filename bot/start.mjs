// import logger from "../web/logger/index.mjs";
import Bot from "db/models/bot.mjs";
import DBProvider from "db/loader.mjs";
import DefaultBot from "./bot/default-bot.mjs";
import Boss from "./servises/pg-boss/pg-boss.mjs";

const db = new DBProvider(
  "postgres://postgres:postgres@localhost:5432/telegramBotDB"
);

(async () => {
  try {
    await db.connectToDB();
    const bots = await Bot.findAll();
    global.allInstances = {};

    //if there is no bots just return
    if (!bots.length) {
      return;
    }

    const boss = new Boss();

    const obj = await boss.start();

    for (let myBot of bots) {
      const token = myBot.token;
      const botWorker = new DefaultBot(token);
      botWorker.start(myBot);
    }
  } catch (err) {
    console.error(err);
  }
})();
