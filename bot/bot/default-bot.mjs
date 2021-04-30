import Bot from "./bot.mjs";
import TelegramBot from "node-telegram-bot-api";
import cityTimezones from "city-timezones";
import scheduler ,{jobHandler} from "../scheduler.js";


class DefaultBot extends Bot {
  constructor(token) {
    super(token);
    this.bot = new TelegramBot(token, { polling: true });
  }

  start(myBot) {
    //add bot to global space 
    Object.assign(global.allInstances, { [myBot.id]: this.bot });

    this.bot.onText(/\/auth (.+)/, this.#auth(myBot));

    this.bot.onText(/\/timezone (.+)/, this.#timzoneSave(myBot));

    this.bot.onText(/\/updateTimezone (.+)/, this.#updateTimezone(myBot));

    this.bot.onText(/\/echo (.+)/, this.#echo(myBot));

    this.bot.onText(/\/start/, this.#start(myBot));

    this.bot.onText(/\/help/, this.#helpService(myBot));

    this.bot.on("message", this.#onListener(myBot));

    this.bot.onText(/\/reminder (.+)/, this.#reminder(myBot));

    this.bot.onText(/\/showInfo/, this.#showInfo(myBot));
  }

  #timeParser(time) {
    let hour = Number(time.split(":")[0]);
    let minute = Number(time.split(":")[1]);
  
    hour = hour >= 1 && hour <= 24 ? hour : null;
    minute = (minute >= 1 && minute <= 59) || minute == 0 ? minute : null;
  
    return {
      minute,
      hour,
    };
  }
  
  #getTimeZone(myBot) {
    let city = myBot.get('timezone').toLowerCase();
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

  #helpService(myBot){
    return async(msg) => {
      if (myBot.owner !== msg.from.id) {
        this.bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      this.bot.sendMessage(
        msg.chat.id,
        `List of usefull comands:
              /auth <Password> - simple authorization for user
              /start - start bot and show keybord
              /echo <random message> - test bot with displaying message
              hi - greeting
              bye - say goodbye and log out
              /reminder - command for activating to cron task and to send reminder to you when time will come
              format to input data : /reminder <time> <task name(what need to be done)>
              /timezone - command for remember your time zone. For correct working reminder.
              format to input data : <City Name(Chicago)>
              /changeTimezone - command for adjust user time zone
              format to input data : <City Name(Chicago)>
              /showInfo - command for display time zone info
              `
      );
    }
  }

  #onListener(myBot){
    return async (msg) => {
      if (msg.text.startsWith("/")) {
        return;
      }

      if (myBot.owner !== msg.from.id) {
        this.bot.sendMessage(
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
        keyboard: "Keyboard"
      };

      if (
        msg.text.toString().toLowerCase().indexOf(botComands.greeting) === 0
      ) {
        this.bot.sendMessage(msg.chat.id, "Hello dear user");
      }
      if (msg.text.toString().toLowerCase().includes(botComands.goodBye)) {
        myBot.owner = null;
        await myBot.save();
        this.bot.sendMessage(
          msg.chat.id,
          "Was very glad to hear you Dear user , Bye"
        );
      }
      if (msg.text.indexOf(botComands.robot) === 0) {
        this.bot.sendMessage(msg.chat.id, "Yes I'm robot but not in that way!");
      }
      if (msg.text.indexOf(botComands.text1) === 0) {
        this.bot.sendMessage(msg.chat.id, "It is just simple text");
      }
      if (msg.text.indexOf(botComands.text2) === 0) {
        this.bot.sendMessage(msg.chat.id, "Another one simple text");
      }
      if (msg.text.indexOf(botComands.keyboard) === 0) {
        this.bot.sendMessage(msg.chat.id, "You just use keyboard");
      }
    }
  }

  #reminder(myBot){
    return async (msg, match) => {
      if (myBot.owner !== msg.from.id) {
        this.bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }

      const receivedReminderText = match[1].trim();

      const timeAndTask = receivedReminderText.split(" ");
        // .slice(0, -1)
        // .join(" ");

      const parseMessageData = {
        time: timeAndTask[0],
        toDo: timeAndTask.slice(1).join(" "),
      };
      const { minute, hour } = this.#timeParser(parseMessageData.time);

      if (minute === null || hour === null) {
        this.bot.sendMessage(
          msg.chat.id,
          `Please enter time in correct format
          example: 21:54 `
        );
        return;
      }

      const { timeZone } = this.#getTimeZone(myBot);

      if (!timeZone) {
        this.bot.sendMessage(
          msg.chat.id,
          `System could not determine you time zone please check if you enter correct it with auth`
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

      const objParams = {
        queue,
        timeString : `${minute} ${hour} * * *`,
        queueParams,
        timeZone : {
            tz: timeZone
          }
      }

      await scheduler.pgBossSchedule(objParams);

      this.bot.sendMessage(msg.chat.id, "Reminder activated");

      //pg-boss subscription to the task;
      scheduler.pgBossSubscribe(queue, jobHandler);
    }
  }

  #start(myBot){
    return (msg) => {
      if (myBot.owner !== msg.from.id) {
        this.bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      this.bot.sendMessage(msg.chat.id, "Welcome", {
        reply_markup: {
          keyboard: [
            ["Sample text", "Second sample"],
            ["Keyboard"],
            ["I'm robot"],
          ],
        },
      });
    }
  }

  #echo(myBot){
    return (msg, match) => {
      if (myBot.owner !== msg.from.id) {
        this.bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      const chatId = msg.chat.id;
      const resp = match[1]; // the captured "whatever"
      this.bot.sendMessage(chatId, resp);
    }
  }

  #auth(myBot){
    return async (msg, match) => {
      const chatId = msg.chat.id;
      if (match[1] === myBot.password) {
        myBot.owner = msg.from.id;
        await myBot.save();
        this.bot.sendMessage(chatId, "welcome dear user you are authorized Also please use /timezone comand to enter your timezone Details /help");
      }
      return;
    }
  }

  #timzoneSave(myBot){
    return async(msg,match) => {
      if (myBot.owner !== msg.from.id) {
        this.bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      if(myBot.get('timezone')){
        this.bot.sendMessage(
          msg.chat.id,
          "You already setup timezone. If you want to change it please use /updateTimezone"
        );
        return;
      };
      const timezone = match[1];
      myBot.timezone = timezone;
      console.log("myBot", myBot);
      await myBot.save();
      this.bot.sendMessage(
        msg.chat.id,
          `thanks , ${match[1]} is saved as timezone`
      );
      return;
    }
  }

  #updateTimezone(myBot){
    return async(msg,match) => {
      if (myBot.owner !== msg.from.id) {
        this.bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      if(!myBot.timezone){
        this.bot.sendMessage(msg.chat.id, `You did not set your time zone yet Please use commands /timezone`);
        return;
      }
      const timezone = match[1];
      myBot.timezone = timezone;
      myBot.save();
      this.bot.sendMessage(
        msg.chat.id,
          `thanks , ${match[1]} is updated as timezone`
      );
      return;
    }
  }

  #showInfo(myBot){
    return async(msg) => {
      if (myBot.owner !== msg.from.id) {
        this.bot.sendMessage(
          msg.chat.id,
          "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
        );
        return;
      }
      this.bot.sendMessage(
        msg.chat.id,
          `your time zone is ${myBot.get('timezone')}`
      );
      return;
    }
  }


}

export default DefaultBot;
