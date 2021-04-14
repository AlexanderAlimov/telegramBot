const allTelegramBotInstances = require("../bot/index").allTelegramBotInstances;
const Bot = require("../models").Bots;

const jobHandler = async(data)=>{
    console.log(`job ${data.id} received with data:`);
    console.log(JSON.stringify(data.data));
    sendNotification(data.data)

}

const sendNotification = async(data) =>{
    const myBot = await Bot.findOne({
        where:{id: data.botId}
    });

    let bot = global.allInstances.find(instance=>instance.token === myBot.get('token'));

    bot.sendMessage(data.chatId, "you have to log your time");
}

module.exports = jobHandler;