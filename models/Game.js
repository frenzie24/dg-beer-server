const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Game extends Model { }

Game.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            references: { model: 'User', key: 'id', unique: false },
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        current_player_turn: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        current_round: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        last_date_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        timestamps: false,
        createdAt: 'date_created', // Alias for createdAt
        updatedAt: 'date_last_updated', // Alias for updatedAt
        freezeTableName: true,
        underscored: true,
        modelName: 'Game',
    }
);

module.exports = Game;
