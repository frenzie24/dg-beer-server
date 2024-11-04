const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class History extends Model { }

History.init(
    {
        player_id: {
            type: DataTypes.INTEGER,
            references: { model: "Player", key: 'id', unique: false },
            allowNull: false,
        },
        game_id: {
            type: DataTypes.INTEGER,
            references: { model: "Game", key: 'id', unique: false },
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: { model: "User", key: 'id', unique: false },
        },
        log: {
            type: DataTypes.TEXT, // This allows for a large amount of text
            allowNull: false,
        },
        date_created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        date_last_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        timestamps: true, // Automatically adds createdAt and updatedAt fields
        createdAt: 'date_created', // Alias for createdAt
        updatedAt: 'date_last_updated', // Alias for updatedAt
        freezeTableName: true,
        underscored: true,
        modelName: 'History',
    }
);

module.exports = History;
