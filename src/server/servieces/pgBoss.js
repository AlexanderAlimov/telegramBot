const PgBoss = require('pg-boss');
const boss = new PgBoss('postgres://postgres:postgres@127.0.0.1/telegramBotDB');

const createReminderWithPgBoss = async () => {
    
    boss.on('error', error => console.error(error));
  
    await boss.start();
  
  }
  
  module.exports.pgBossInitialize = createReminderWithPgBoss;
  module.exports.pgBoss = boss;

