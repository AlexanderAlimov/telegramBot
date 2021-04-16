const jobHandler = async (data) => {
  console.log(`job ${data.id} received with data:`);
  console.log(JSON.stringify(data.data));
  sendNotification(data.data);
};

const sendNotification = async (data) => {
  global.allInstances[data.botId].sendMessage(data.chatId, `${data.data}`);
};

module.exports = jobHandler;
