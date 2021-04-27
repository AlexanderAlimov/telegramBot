"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("bots", "authorizedUserId", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("bots", "authorizedUserId"),
    ]);
  },
};
