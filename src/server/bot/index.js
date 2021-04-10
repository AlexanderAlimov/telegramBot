const TelegramBot = require("node-telegram-bot-api");
const Bot = require("../models").Bots;

(async()=>{

  const data = await Bot.findOne({where:{id: 2}});

  const bot = new TelegramBot(data.token, { polling: true });

    bot.onText(/\/auth (.+)/, async(msg, match) => {
      const chatId = msg.chat.id;
      if(match[1] === data.password){
        const myBot = await Bot.findOne({where: {id:2}})
        myBot.authorized = true;
        await myBot.save();
        bot.sendMessage(chatId, "welcome dear user you are authorized");
      }
      return;
     
    });

    // Matches "/echo [whatever]"
    bot.onText(/\/echo (.+)/, (msg, match) => {
      if(!data.authorized){
        bot.sendMessage(msg.chat.id,"Hello dear user, first You need to authorized. Please use /auth comand and enter your password.");
        return;
      }
      const chatId = msg.chat.id;
      const resp = match[1]; // the captured "whatever"
      bot.sendMessage(chatId, resp);
    });

    bot.onText(/\/start/, (msg) => {
      if(!data.authorized){
        bot.sendMessage(msg.chat.id,"Hello dear user, first You need to authorized. Please use /auth comand and enter your password.");
        return;
      }
      bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup": {
            "keyboard": [["Sample text", "Second sample"],   ["Keyboard"], ["I'm robot"]]
            }
        });
    });

    bot.on('message', async(msg)=>{

      const findBot = await Bot.findOne({where:{id:2}});

      if(!findBot.authorized){
        bot.sendMessage(msg.chat.id,"Hello dear user, first You need to authorized. Please use /auth comand and enter your password.");
        return;
      }

      const botComands = {
        greeting: "hi",
        goodBye: "bye",
        robot: "I'm a robot",
        text1: "Sample text",
        text2: "Second sample",
        keyboard: "Keyboard"
      }

      if(msg.text.toString().toLowerCase().indexOf(botComands.greeting) === 0){
        bot.sendMessage(msg.chat.id,"Hello dear user");
      }
      if(msg.text.toString().toLowerCase().includes(botComands.goodBye)){
        findBot.authorized = false;
        await findBot.save();
        bot.sendMessage(msg.chat.id,"Was very glad to hear you Dear user , Bye");
      }
      if (msg.text.indexOf(botComands.robot) === 0) {
          bot.sendMessage(msg.chat.id, "Yes I'm robot but not in that way!");
      }
      if (msg.text.indexOf(botComands.text1) === 0) {
          bot.sendMessage(msg.chat.id, "It is just simple text");
      }
      if (msg.text.indexOf(botComands.text2) === 0) {
          bot.sendMessage(msg.chat.id, "Another one simple text");
      }
      if (msg.text.indexOf(botComands.keyboard) === 0) {
          bot.sendMessage(msg.chat.id, "You just use keyboard");
      }
    })

})();




