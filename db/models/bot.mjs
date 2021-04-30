import Sequelize from "sequelize";

class Bot extends Sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        botName: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        token: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        owner: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        timezone: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        underscored: true,
        tableName: "bot",
        freezeTableName: true,
      }
    );
  }
}

export default Bot;
