const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Player extends Model { }

Player.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
    inventory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ordered: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    received: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalReceived: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pendingReceived: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roundsPending: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    history: {
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
