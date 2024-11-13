const sequelize = require('../config/connection');
const { User, Game, Player, History } = require('../models');

// data to seed with
const userData = require('./userData.json');
const gameData = require('./gameData.json')
const playerData = require('./playerData.json');
const historyData = require('./historyData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  console.log('userData:', userData);
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
/*
  console.log('gameData:', gameData);
  const games = await Game.bulkCreate(gameData, {
    individualHooks: true,
    returning: true,
  });


  console.log('playerData:', playerData);
  const players = await Player.bulkCreate(playerData, {
    individualHooks: true,
    returning: true,
  });

  console.log('historyData:', historyData);
  const history = await History.bulkCreate(historyData, {
    individualHooks: true,
    returning: true,
  });
*/
  process.exit(0);
};

seedDatabase();
