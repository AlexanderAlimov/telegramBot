import Bot from "./bot.mjs";
import TelegramBot from "node-telegram-bot-api";
// import cityTimezones from "city-timezones";
// import scheduler ,{jobHandler} from "../scheduler.mjs";
import BotService from "../servises/bot-service.mjs"


class DefaultBot extends Bot {
  constructor(token, botEntity) {
    super(token);
    this.bot = new TelegramBot(token, { polling: true });
    this.myBot = botEntity;
    this.botService = new BotService(botEntity);
  }

  start() {
    //add bot to global space 
    Object.assign(global.allInstances, { [this.myBot.id]: this.bot });

    this.bot.onText(/\/auth (.+)/, this.#auth());

    this.bot.onText(/\/timezone (.+)/, this.#timzoneSave(this.myBot));

    this.bot.onText(/\/updateTimezone (.+)/, this.#updateTimezone(this.myBot));

    this.bot.onText(/\/echo (.+)/, this.#echo());

    this.bot.onText(/\/start/, this.#start());

    this.bot.onText(/\/help/, this.#helpService());

    this.bot.on("message", this.#onListener());

    this.bot.onText(/\/reminder (.+)/, this.#reminder());

    this.bot.onText(/\/showInfo/, this.#showInfo(this.myBot));
  }

  #helpService(){
    return async(msg) => {
      const chatId = msg.chat.id;
      const preauthMessage = this.botService.preAuthCheck(msg.from.id)
      if(preauthMessage){
        this.bot.sendMessage(chatId, preauthMessage);
        return;
      }
      this.bot.sendMessage(
        msg.chat.id,
        this.botService.helpServiceMessage()
      );
    }
  }

  #onListener(){
    return async (msg) => {
      if (msg.text.startsWith("/")) {
        return;
      }

      const chatId = msg.chat.id;
      const preauthMessage = this.botService.preAuthCheck(msg.from.id)
      if(preauthMessage){
        this.bot.sendMessage(chatId, preauthMessage);
        return;
      }

      const sendMessage = await this.botService.onListener(msg);
      this.bot.sendMessage(chatId, sendMessage );

    }
  }

  #reminder(){
    return async (msg,match) => {
      const chatId = msg.chat.id;
      const preauthMessage = this.botService.preAuthCheck(msg.from.id)
      if(preauthMessage){
        this.bot.sendMessage(chatId, preauthMessage);
        return;
      }

      const reminderMessage = await this.botService.reminder(msg,match);

      this.bot.sendMessage(chatId, reminderMessage);

    }
  }

  #start(){
    return (msg) => {
      const chatId = msg.chat.id;
      const preauthMessage = this.botService.preAuthCheck(msg.from.id)
      if(preauthMessage){
        this.bot.sendMessage(chatId, preauthMessage);
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

  #echo(){
    return (msg, match) => {
     const chatId = msg.chat.id;
     const preauthMessage = this.botService.preAuthCheck(msg.from.id)
     if(preauthMessage){
      this.bot.sendMessage(chatId, preauthMessage);
      return;
     }
      const resp = match[1]; // the captured "whatever"
      this.bot.sendMessage(chatId, resp);
    }
  }

  #auth(){
    return async (msg, match) => {
      const chatId = msg.chat.id;

      const password = match[1];
      const fromId = msg.from.id;

      const resultAuth = await this.botService.auth(password, fromId);

      this.bot.sendMessage(chatId, resultAuth);
      
      return;
    }
  }

  #timzoneSave(){
    return async(msg,match) => {
      const chatId = msg.chat.id;
      const preauthMessage = this.botService.preAuthCheck(msg.from.id)
      if(preauthMessage){
        this.bot.sendMessage(chatId, preauthMessage);
        return;
      }

      const timeZoneSendMessage = await this.botService.timezoneSave(match);

      this.bot.sendMessage(chatId, timeZoneSendMessage);

      return;
    }
  }

  #updateTimezone(myBot){
    return async(msg,match) => {
      const chatId = msg.chat.id;
      const preauthMessage = this.botService.preAuthCheck(msg.from.id)
      if(preauthMessage){
        this.bot.sendMessage(chatId, preauthMessage);
        return;
      }

      const updateTimezoneMessage = await this.botService.updateTimezone(match)

      this.bot.sendMessage(chatId,updateTimezoneMessage);

      return;
    }
  }

  #showInfo(myBot){
    return async(msg) => {
      const chatId = msg.chat.id;
      const preauthMessage = this.botService.preAuthCheck(msg.from.id)

      if(preauthMessage){
        this.bot.sendMessage(chatId, preauthMessage);
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
