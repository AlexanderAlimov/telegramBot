import scheduler ,{jobHandler} from "../scheduler.mjs";
import cityTimezones from "city-timezones";
class BotService {

    constructor(botEntity) {
        this.myBot = botEntity;
    }

    async auth (password, fromId){
        let message = "Error on auth of user";
        
        //todo: Проверка на формат сообщения или формат пароля

        if (!password) {
          message = "Password is missed. Please check it and try again"
          return message;
        }
    
        if (password.length < 2) {
          message = "Invalid password format. Please check it and try again"
          return message;
        }
    
        if (password === this.myBot.password) {
          this.myBot.owner = fromId;
          await this.myBot.save(); 
          message = "welcome dear user you are authorized Also please use /timezone comand to enter your timezone Details /help"  
        }
    
        return message;
      }

      preAuthCheck(fromId){
        let message = null
        if (this.myBot.owner !== fromId) {
          message = "Hello dear user, first You need to authorized. Please use /auth comand and enter your password."
          return message;
        }
        return message;
      }

      helpServiceMessage(){
        let message = `List of usefull comands:
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
        return message
      }

      async onListener(msg){
        let message = "Nothing matchMedia, please try again";

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
          message = "Hello dear user"
        }
        if (msg.text.toString().toLowerCase().includes(botComands.goodBye)) {
           if(this.myBot.id){
            this.myBot.owner = null
            await this.myBot.save()
           }
           message ="Was very glad to hear you Dear user , Bye"
        }
        if (msg.text.indexOf(botComands.robot) === 0) {
          message = "Yes I'm robot but not in that way!"
        }
        if (msg.text.indexOf(botComands.text1) === 0) {
          message = "It is just simple text"
        }
        if (msg.text.indexOf(botComands.text2) === 0) {
          message = "Another one simple text"
        }
        if (msg.text.indexOf(botComands.keyboard) === 0) {
          message = "You just use keyboard"
        }
        return message
      }

      async reminder(msg,match){
         let message = "Reminder not activated";
         const receivedReminderText = match[1].trim();

          const timeAndTask = receivedReminderText.split(" ");

          const parseMessageData = {
            time: timeAndTask[0],
            toDo: timeAndTask.slice(1).join(" "),
          };
          const { minute, hour } = this.timeParser(parseMessageData.time);

          if (minute === null || hour === null) {
            return message = `Please enter time in correct format example: 21:54 `
          }

          const { timeZone } = this.getTimeZone(this.myBot);

          if (!timeZone) {
            return message = `System could not determine you time zone please check if you enter correct it with auth`
          }

          const queue = parseMessageData.toDo;
          const queueParams = {
            botId: this.myBot.id,
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

          message = "Reminder activated";

          //pg-boss subscription to the task;
          scheduler.pgBossSubscribe(queue, jobHandler);

          return message;
      }

      timeParser(time) {
        let hour = Number(time.split(":")[0]);
        let minute = Number(time.split(":")[1]);
      
        hour = hour >= 1 && hour <= 24 ? hour : null;
        minute = (minute >= 1 && minute <= 59) || minute == 0 ? minute : null;
      
        return {
          minute,
          hour,
        };
      }
      
      getTimeZone() {
        let city = this.myBot.timezone.toLowerCase();
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

      async timezoneSave(match){
        let message = "";
        if(this.myBot.get('timezone')){
          return message = "You already setup timezone. If you want to change it please use /updateTimezone"
        };
        const timezone = match[1];
        this.myBot.timezone = timezone;
        await myBot.save();
        return message = `thanks , ${match[1]} is saved as timezone`
        
      }

      async updateTimezone(match){
        let message = ""
        if(!this.myBot.timezone){
          return message = `You did not set your time zone yet Please use commands /timezone`
        }
        const timezone = match[1];
        this.myBot.timezone = timezone;
        await this.myBot.save();
        return message = `thanks , ${match[1]} is updated as timezone`
      }
}

export default BotService;