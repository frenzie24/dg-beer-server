const router = require('express').Router();
const { User, Game } = require('../../models');
const withAuth = require('../../utils/auth');
const handleError = require('../../utils/handleError')
const { log, info, warn, error } = require('@frenzie24/logger');


router.delete('/:id', withAuth, async (req, res) => {

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
  log(req);
  try {

    if (req.query.id) {
      warn('Attemping to find game by id');
      const gamesData = await Game.findAll({ where: { user_id: req.query.id } });

      res.status(200).json(gamesData);
    } else {

      warn('Attemping to find all games');
      const gamesData = await Game.findAll();
      res.status(200).json(gamesData);
   }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a new game
router.post('/', withAuth, async (req, res) => {
  const { score } = req.body;
  log(req.body);
  try {
    const newGame = await Game.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    // new game added to the data base, log it and send a response
    info('New game created!')
    res.status(201).json(newGame);
  } catch (error) {
    handleError(err, req.session.logged_in, res);
    res.status(400).json({ error: error.message });
  }
});

// Update an existing game by ID
router.patch('/', withAuth, async (req, res) => {

  const { score, current_player_turn, current_round } = req.body;
  log('============================');
  info(`updating Game id: ${req.query.id}`);
  log(req.body, 'red', 'bgWhite');
  try {
    const _id = Math.floor(req.query.id);
    if (!Number.isInteger(_id)) {
        warn(`Bad request: id invalid`);
        return handleError(err, req.session.logged_in, res);

    }
    const game = await Game.findByPk(_id);
    game.content = req.body.content;
    game.save();
    return res.status(200).json({game: game, message: "Game updated"})
/*
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this game' });
    }

    await game.update({
      score,
      current_player_turn,
      current_round,
      last_date_updated: new Date()
    });

    res.status(200).json(game);*/
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
