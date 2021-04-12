const createReminderWithPgBoss = async () => {
    const PgBoss = require('pg-boss');
    const boss = new PgBoss('postgres://postgres:postgres@127.0.0.1/telegramBotDB');
  
    boss.on('error', error => console.error(error));
  
    await boss.start();
  
    const queue = 'track-your-time';
  
    await boss.subscribe(queue, someAsyncJobHandler);
  }
  
  async function someAsyncJobHandler(job) {
    console.log("job", job);
    console.log(`job ${job.id} received with data:`);
    console.log(JSON.stringify(job.data));
  
    await doSomethingAsyncWithThis(job.data);
  }

  async function doSomethingAsyncWithThis(data){
    const TelegramBot = require("node-telegram-bot-api");
    const Bot = require("../models").Bots;
    const myBot = await Bot.findOne({where:{id: data.botId}});
    const bot = new TelegramBot(myBot.token, { polling: true });
    bot.sendMessage(data.chatId, "Check pg boss!");
    bot.stopPolling();
  }

  module.exports = createReminderWithPgBoss;
