const TelegramBot = require('node-telegram-bot-api');
const Bot = require("../models").Bots;

Bot.findOne({where:{id:2}})
.then( data => {
    const bot = new TelegramBot(data.token, {polling: true})

    bot.on('message', msg => {
        const { chat: {id}} = msg;
        bot.sendMessage(id, 'Echo')
    })

})


