const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Player extends Model {}

Player.init(
  {
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: 'id', unique: false },
        allowNull: false,
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: { model: "Game", key: 'id', unique: false },
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Player',
  }
);

module.exports = Player;
