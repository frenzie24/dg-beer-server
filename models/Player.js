const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Player extends Model { }

Player.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: "User", key: 'id', unique: false },
      allowNull: true,
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: { model: "Game", key: 'id', unique: false },
      allowNull: true,
    },
    inventory: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ordered: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    received: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalReceived: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pendingReceived: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    roundsPending: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    history: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'Player',
  }
);

module.exports = Player;
