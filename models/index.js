const User = require('./User');
const Game = require('./Game');
const Player = require('./Player');
const History = require('./History');

// User relationships
User.hasMany(Game, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

User.hasMany(Player, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

User.hasMany(History, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Game.belongsTo(User, {
    foreignKey: 'user_id',
});

// Game relationships
Game.hasMany(Player, {
    foreignKey: "game_id",
    onDelete: "CASCADE"
});

Game.hasMany(History, {
    foreignKey: "game_id",
    onDelete: "CASCADE"
});

// Player relationships
Player.belongsTo(User, {
    foreignKey: 'user_id'
});

Player.hasMany(History, {
    foreignKey: "player_id",
    onDelete: "CASCADE"
});

Player.belongsTo(Game, {
    foreignKey: "game_id"
});

// History relationships
History.belongsTo(Player, {
    foreignKey: 'player_id'
});

History.belongsTo(User, {
    foreignKey: 'user_id'
});

History.belongsTo(Game, {
    foreignKey: "game_id"
});

// Export all models
module.exports = { User, Game, History, Player };
