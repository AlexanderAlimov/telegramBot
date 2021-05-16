
class BotService {

    constructor(botEntity) {
        this.myBot = botEntity;
    }

    async auth (password, fromId){
        let message = "Error on auth of user";
        
        //todo: Проверка на формат сообщения или формат пароля
    
        if (password.length === 0 || password === null) {
          message = "Invalid password format. Please use etc..."
          return message;
        }
    
        if (password === this.myBot.password) {
          this.myBot.owner = fromId;
          await this.myBot.save(); 
          message = "welcome dear user you are authorized Also please use /timezone comand to enter your timezone Details /help"  
        }
    
        return message;
      }

      reminder(etc) {
          throw new Error('error');
      }
}

export default BotService;