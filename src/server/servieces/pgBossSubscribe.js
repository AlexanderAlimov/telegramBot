const { pgBoss } = require("./pgBoss");
const jobHandler = require('./jobHandler');

const pgBossSubscribe = async(queue)=>{

    await pgBoss.subscribe(queue, jobHandler);
    // const jobs = await pgBoss.fetch(queue);
    // console.log("jobs============", jobs);
}

module.exports = pgBossSubscribe;