module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'alter table if exists "bots" rename to bot;\n'
    );
    await queryInterface.sequelize.query(
      'alter table if exists bot rename column "botName" to bot_name;\n'
    );
    await queryInterface.sequelize.query(
      'alter table if exists bot rename column "createdAt" to created_at;\n'
    );
    await queryInterface.sequelize.query(
      'alter table if exists bot rename column "updatedAt" to updated_at;\n'
    );
    await queryInterface.sequelize.query(
      "alter table if exists bot drop column authorized;\n"
    );
    await queryInterface.sequelize.query(
      'alter table if exists bot rename column "authorizedUserId" to owner;'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'alter table if exists bot rename to "bots";\n'
    );
    await queryInterface.sequelize.query(
      'alter table if exists "Bots" rename column bot_name to "botName" ;\n'
    );
    await queryInterface.sequelize.query(
      'alter table if exists "Bots" rename column created_at to "createdAt"  ;\n'
    );
    await queryInterface.sequelize.query(
      'alter table if exists "Bots" rename column updated_at to "updatedAt";\n'
    );
    await queryInterface.sequelize.query(
      'alter table if exists "Bots" create column authorized;\n'
    );
    await queryInterface.sequelize.query(
      'alter table if exists "Bots" rename column owner to "authorizedUserId";'
    );
  },
};
