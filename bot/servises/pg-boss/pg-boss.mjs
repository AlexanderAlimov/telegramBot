import PgBoss from "pg-boss";

class Boss {
    constructor(connectionString){
        this.boss = new PgBoss(connectionString);
    }

    async start(){
        this.boss.on("error", (error) => console.error("Eror =", error));
        this.boss.on("monitor-states", (state) => console.log(state));

        return await this.boss.start();
    }

    async pgBossSchedule({queue,timeString,queueParams,timZone}){
        await this.boss.schedule(queue,timeString,queueParams,timZone);
    }

    async pgBossSubscribe(queue){
        await this.boss.subscribe(queue, this.#jobHandler);
    }

    #jobHandler(data){
        console.log(`job ${data.id} received with data:`);
        console.log(JSON.stringify(data.data));
        this.#sendNotification(data.data);
    }

    #sendNotification(data){
        global.allInstances[data.botId].sendMessage(data.chatId, `${data.data}`);
    }
}

export default Boss;