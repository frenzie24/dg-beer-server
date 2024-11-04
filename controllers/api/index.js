const router = require('express').Router();
const userRoutes = require('./userRoutes');
const gameRoutes = require('./gameRoutes');
const historyRoutes = require('./historyRoutes');
const playerRoutes = require('./playerRoutes');
const emailRoutes = require('./emailRoutes');

router.use('/users', userRoutes);
router.use('/games', gameRoutes);

router.use('/history', historyRoutes);

router.use('/player', playerRoutes);

router.use('/email', emailRoutes);

module.exports = router;
