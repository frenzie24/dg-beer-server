const router = require('express').Router();
const { User, Game, Player } = require('../../models');
const withAuth = require('../../utils/auth');
const handleError = require('../../utils/handleError')
const { log, info, warn, error } = require('@frenzie24/logger');


router.delete('/:id', withAuth, async (req, res) => {
  console.log('DELETE request received for ID:', req.params.id);

  log('attempting to destory game data')

  info(JSON.stringify(req.params))
  try {
    const gameData = await Game.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!gameData) {

      warn(`No Game found`);
      res.status(404).json({ message: 'No game found with this id!' });
      return;
    }
    log('Game deleted', 'green');
    res.status(200).json(gameData);
  } catch (err) {
    warn('We ran into an error:')
    error(err);
    res.status(500).json(err);
  }
});

// Get all games for a user
router.get('/', withAuth, async (req, res) => {
  log('Get games request')
  // log(req);
  try {

    if (req.query.id) {
      warn('Attemping to find game by id');
      const games = await Game.findAll({
        where: { user_id: req.session.user_id }, include: [{
          model: Player, where: { user_id: req.query.id }, required: false // Use false if you want games even if they don't have players
        }]
      }); res.status(200).json(games)
    } else {

      warn('Attemping to find all games');
      const gamesData = await Game.findAll();
      info('gamesData found: ', gamesData);
      res.status(200).json(gamesData);
    }
  } catch (error) {
    warn(error);
    res.status(400).json({ error: error.message });
  }
});

// Add a new game
router.post('/', withAuth, async (req, res) => {

 log(req.body);
  try {
    const game = await Game.create({
      ...req.body.game,
      user_id: req.session.user_id,
    });
    // new game added to the data base, log it and send a response
    info(`New game created!${game.id}`)


    req.body.players.forEach(player => {
      warn((player.role_id));
    });

    const _players = req.body.players.map((player) => {
      info(game.id);
      player.game_id = game.id;
    })
    const players = await Player.bulkCreate(_players);
    const data = { game: game, players: players };
    res.status(200).json(data);
  } catch (error) {
    handleError(error, req.session.logged_in, res);
    /// res.status(400).json({ error: error.message });
  }
});

// Update an existing game by ID
router.put('/', withAuth, async (req, res) => {
  log('============================');
 // warn(JSON.stringify(req.body));
  info(`updating Game id: ${req.body.game.id}`);
  log(req.body.game, 'red', 'bgWhite');

  try {
    const _id = Math.floor(req.body.game.id);
    if (!Number.isInteger(_id)) {
      warn(`Bad request: id invalid`);
      return handleError(new Error('Invalid game id'), req.session.logged_in, res);
    }

    const updated = await Game.update(req.body.game, { where: { id: _id } });

    if (!updated[0]) {
      error('User not authorized to update this game.')
      return res.status(400).json({ error: 'Game not updated' });
    }

    const playerUpdates = req.body.players.map(player => {
      return Player.update(player, { where: { game_id: _id, user_id: req.session.user_id } });
    });

    await Promise.all(playerUpdates);

    return res.status(200).json({ message: "Game and players updated" });
  } catch (error) {
    log(error);
    handleError(error, req.session.logged_in, res);
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  }
});

module.exports = router;
