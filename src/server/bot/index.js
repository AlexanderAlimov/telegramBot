const TelegramBot = require("node-telegram-bot-api");
const cityTimezones = require("city-timezones");
const Bot = require("../models").Bots;
const pgBoss = require("../servieces/pgBoss").pgBoss;
const subscribeToJob = require("../servieces/pgBossSubscribe");

const initializeBot = async () => {
  const allBots = await Bot.findAll({});
  global.allInstances = {};

  if (!allBots.length) {
    return;
  }

  for (const myBot of allBots) {
    const bot = new TelegramBot(myBot.token, { polling: true });
    Object.assign(global.allInstances, { [myBot.id]: bot });

    bot.onText(/\/auth (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      if (match[1] === myBot.password) {
        myBot.authorizedUserId = msg.from.id;
        await myBot.save();
        bot.sendMessage(chatId, "welcome dear user you are authorized");
      }
      return;
    });

    bot.onText(/\/reminder (.+)/, async (msg, match) => {
      if (myBot.authorizedUserId !== msg.from.id) {
        bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }

      const receivedReminderText = match[1].trim();
      const getCityFromReminder = receivedReminderText
        .split(" ")
        .splice(-1)
        .pop();
      const timeAndTask = receivedReminderText
        .split(" ")
        .slice(0, -1)
        .join(" ");

      const parseMessageData = {
        time: timeAndTask.split(" ")[0],
        toDo: timeAndTask.split(" ").splice(1).join(" "),
      };
      const { minute, hour } = timeParser(parseMessageData.time);

      if (minute === null || hour === null) {
        bot.sendMessage(
          msg.chat.id,
          `Please enter time in correct format
          example: 21:54 `
        );
        return;
      }

      const { timeZone } = getTimeZone(getCityFromReminder);
      if (!timeZone) {
        bot.sendMessage(
          msg.chat.id,
          `Please enter correct name of your city
          example: Chicago `
        );
        return;
      }

      const queue = parseMessageData.toDo;
      const queueParams = {
        botId: myBot.id,
        chatId: msg.chat.id,
        time: parseMessageData.time,
        data: parseMessageData.toDo,
      };

      await pgBoss.schedule(queue, `${minute} ${hour} * * *`, queueParams, {
        tz: timeZone,
      });

      bot.sendMessage(msg.chat.id, "Reminder activated");

      //pg-boss subscription to the task;
      subscribeToJob(queue);
    });

    // Matches "/echo [whatever]"
    bot.onText(/\/echo (.+)/, (msg, match) => {
      if (myBot.authorizedUserId !== msg.from.id) {
        bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      const chatId = msg.chat.id;
      const resp = match[1]; // the captured "whatever"
      bot.sendMessage(chatId, resp);
    });

    bot.onText(/\/start/, (msg) => {
      if (myBot.authorizedUserId !== msg.from.id) {
        bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      bot.sendMessage(msg.chat.id, "Welcome", {
        reply_markup: {
          keyboard: [
            ["Sample text", "Second sample"],
            ["Keyboard"],
            ["I'm robot"],
          ],
        },
      });
    });

    bot.onText(/\/help/, (msg) => {
      if (myBot.authorizedUserId !== msg.from.id) {
        bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      bot.sendMessage(
        msg.chat.id,
        `List of usefull comands:
      /auth <Password> - simple authorization for user
      /start - start bot and show keybord
      /echo <random message> - test bot with displaying message
      hi - greeting
      bye - say goodbye and log out
      /reminder - command for activating to cron task and to send reminder to you when time will come
      format to input data : /reminder <time> <task name(what need to be done)> <City Name(Chicago)>
      `
      );
    });

    bot.on("message", async (msg) => {
      if (msg.text.startsWith("/")) {
        return;
      }

      if (myBot.authorizedUserId !== msg.from.id) {
        bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }

      const botComands = {
        greeting: "hi",
        goodBye: "bye",
        robot: "I'm robot",
        text1: "Sample text",
        text2: "Second sample",
        keyboard: "Keyboard",
      };

      if (
        msg.text.toString().toLowerCase().indexOf(botComands.greeting) === 0
      ) {
        bot.sendMessage(msg.chat.id, "Hello dear user");
      }
      if (msg.text.toString().toLowerCase().includes(botComands.goodBye)) {
        myBot.authorizedUserId = null;
        await myBot.save();
        bot.sendMessage(
          msg.chat.id,
          "Was very glad to hear you Dear user , Bye"
        );
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
    });
  }
};

function timeParser(time) {
  let hour = Number(time.split(":")[0]);
  let minute = Number(time.split(":")[1]);

  hour = hour >= 1 && hour <= 24 ? hour : null;
  minute = (minute >= 1 && minute <= 59) || minute == 0 ? minute : null;

  return {
    minute,
    hour,
  };
}

function getTimeZone(data) {
  let city = data.toLowerCase();
  city = city.charAt(0).toUpperCase() + city.slice(1);
  let timeZone;
  const cityLookup = cityTimezones.lookupViaCity(city);
  if (!cityLookup.length) {
    timeZone = null;
  }
  timeZone = cityLookup[0].timezone;
  return {
    timeZone,
  };
}

module.exports.initializeBot = initializeBot;
