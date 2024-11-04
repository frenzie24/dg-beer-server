const router = require('express').Router();
const { User, Game } = require('../../models');
const withAuth = require('../../utils/auth');
const handleError = require('../../utils/handleError')
const { log, info, warn, error } = require('@frenzie24/logger');

// Get all games for a user
router.get('/', withAuth, async (req, res) => {
  try {
    const games = await Game.findAll({ where: { user_id: req.user.id } });
    res.json(games);
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
router.put('/:id', withAuth, async (req, res) => {
  const { id } = req.params;
  const { score, current_player_turn, current_round } = req.body;

  try {
    const game = await Game.findByPk(id);

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

    res.json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
