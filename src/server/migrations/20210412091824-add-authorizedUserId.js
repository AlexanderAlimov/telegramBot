'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Bots',
        'authorizedUserId',
        {
          type: Sequelize.INTEGER
        }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Bots', 'authorizedUserId')
    ]);
  }
};
