import Boss from './servises/pg-boss/pg-boss.mjs'

const scheduler = new Boss(
    'postgres://postgres:postgres@127.0.0.1/telegramBotDB');

export const jobHandler = (data) => {
    console.log(`job ${data.id} received with data:`);
    console.log(JSON.stringify(data.data));
    sendNotification(data.data);
}

const sendNotification = (data) => {
    global.allInstances[data.botId].sendMessage(data.chatId, `${data.data}`);
}

export default scheduler;


