const { pgBoss } = require("./pgBoss");
const jobHandler = require("./jobHandler");

const pgBossSubscribe = async (queue) => {
  await pgBoss.subscribe(queue, jobHandler);
};

module.exports = pgBossSubscribe;
