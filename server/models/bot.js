
module.exports = (sequelize, Sequelize) => {
  const Bot = sequelize.define("Bots", {
    botName: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.STRING
    }
  });

  return Bot;
};