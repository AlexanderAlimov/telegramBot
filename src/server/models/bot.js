'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Bot.init({
    token: DataTypes.STRING,
    nameBot: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bot',
  });
  return Bot;
};