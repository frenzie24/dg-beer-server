const router = require('express').Router();
const { User, Game, Player, History } = require('../../models');
const withAuth = require('../../utils/auth');
const handleError = require('../../utils/handleError')
const { log, info, warn, error } = require('@frenzie24/logger');

router.post('/', async (req, res) => {
  console.log('attempting registration')
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      log('user registered', 'green')
      res.status(200).json(userData);
    });
  } catch (err) {
    warn(req)
    error(err)
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  if (req.params.id == req.session.user_id) {

  }
  warn('OMFGGGGGGGGG')
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!userData) {

      warn(`No User found`);
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    log('User deleted', 'green');
    res.status(200).json(userData);
  } catch (err) {
    warn('We ran into an error:')
    error(err);
    res.status(500).json(err);
  }
});

// handles get requests
router.get('/', async (req, res) => {
  log('User request');

  if (req.query.id) {
    log('Retrieving a singple user');
    try {
      const _id = Math.floor(req.query.id);
      log(`id: ${_id}`);
      // if _id is not an integer then exit
      if (!Number.isInteger(_id)) {
        warn(`Bad request: id invalid`); handleError(err, req.session.logged_in, res);

      }
      // find the user by id, include related users and related user's name attribute

      info(`Attempting to retrieve user with id: ${_id}`)
      const userData = await User.findByPk(_id, {
        //models to join to user
        include: [{ model: Game, model: Player, model: History }],
      });

      const user = userData.get({ plain: true });

      return res.status(200).json(userData);
    }
    catch (err) {
      return handleError(err, req.session.logged_in, res);
    }
  } else {
    try {

      const usersData = await User.findAll({
        include: [{ model: Game, model: Player, model: History }],
      });

      // Serialize data so the template can read it
      const users = usersData.map((post) => post.get({ plain: true }));

      log(users)

      return res.status(200).json(usersData);

    }
    catch (err) {
      return handleError(err, req.session.logged_in, res);
    }
  }

});

router.get('/profile', withAuth, async (req, res) => {
  // The session should already be available here
  if (req.session.logged_in) {
    const userData = await User.findByPk(req.session.user_id);
    res.json(userData);
  } else {
    res.status(401).json({ message: 'You must be logged in to view this page.' });
  }
});

// handles logging in
router.post('/login', async (req, res) => {
  info('attempting log in')
 // log(`Req body: ${JSON.stringify(req.body)}` )
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      warn(`userData is undefined`)
      return res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
    }

    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      error(`invalid password attempt;`)
      return res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
    }

    // Set session properties
    req.session.user_id = userData.id;
    req.session.logged_in = true;
    await req.session.save();  // Ensure session is saved before sending response

    log('Login success.', 'brightGreen', 'bgBlack');
    log(req.session);  // Log session to ensure it's correct



    log(`User: ${userData.first_name} has logged in.`);
   // info(`${req.session.user_id}\n${req.session.logged_in}`);
   return res.json({ user: userData, message: 'You are now logged in!' });

  } catch (err) {
    warn('We ran into an error:')
    error(err);
    res.status(400).json(err);
  }
});


// Logs the user out
router.post('/logout', (req, res) => {

  log(`logout attempt\nlogged_in: ${req.session.logged_in}`);
  if (req.session.logged_in) {
    log('Attempting to destroy the session');
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

//update user email
router.post('/logout', (req, res) => {
  log(`logout attempt\nlogged_in: ${req.session}`);

  if (req.session.logged_in) {
    log('User is logged in, attempting to destroy the session');
    req.session.destroy((err) => {
      if (err) {
        log('Error destroying session:', err);
        return res.status(500).json({ message: 'Failed to log out' });
      }

      // Clear the session cookie after destroying the session
      res.clearCookie('connect.sid'); // Use your actual session cookie name here
      log('Session destroyed successfully');
      return res.status(204).end();  // Successfully logged out (204 No Content)
    });
  } else {
    log('User was not logged in');
    res.status(404).json({ message: 'User not logged in' });  // User was not logged in, nothing to logout
  }
});


module.exports = router;
