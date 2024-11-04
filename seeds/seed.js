const sequelize = require('../config/connection');
const { User, Game } = require('../models');

// data to seed with
const userData = require('./userData.json');
const gameData = require('./gameData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  console.log('userData:', userData);
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  console.log('gameData:', gameData);
  const games = await Game.bulkCreate(gameData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
