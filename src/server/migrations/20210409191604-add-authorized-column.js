"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return Promise.all([
    //   queryInterface.addColumn(
    //     'Bots',
    //     'authorized',
    //     {
    //       type: Sequelize.BOOLEAN
    //     }
    //   )
    // ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("Bots", "authorized")]);
  },
};
