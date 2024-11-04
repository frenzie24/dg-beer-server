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
  if(req.params.id == req.session.user_id) {

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

// handles logging in
router.post('/login', async (req, res) => {
  info('attempting log in')
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      warn(`userData is undefinded`)
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);
    // check the password, if submitted password does not match stored hash password for user then exit
    if (!validPassword) {
      error(`invalid password attempt;`)
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    log('Login success.', 'brightGreen', 'bgBlack');
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      log(`User: ${userData.first_name} has logged in.`);
      res.status(200).json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    warn('We ran into an error:')
    error(err);;
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      log('Log out success');
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

//update user email
router.patch('/', withAuth, async (req, res) => {
  log('============================');
  info(`updating user email with id: ${req.query.id}`);
  log(req.body, 'red', 'bgWhite');
  log(req.session);
  // log(req.body.content)

  try {

    const _id = Math.floor(req.session.user_id);
    if (!Number.isInteger(_id)) {
      warn(`Bad request: id invalid`);

    }
    const user = await User.findByPk(_id)

    user.email = req.body.email;
    user.save();
    return res.status(200).json(user);

  } catch (err) {
    return handleError(err, req.session.logged_in, res);
  }
});

module.exports = router;
