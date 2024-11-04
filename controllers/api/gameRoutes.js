const express = require('express');
const jwt = require('jsonwebtoken');
const Game = require('../../models/Game');

const router = express.Router();

// Middleware for token verification
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get all games for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const games = await Game.findAll({ where: { userId: req.user.id } });
    res.json(games);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a new game
router.post('/', authenticateToken, async (req, res) => {
  const { score } = req.body;

  try {
    const newGame = await Game.create({ userId: req.user.id, score });
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
