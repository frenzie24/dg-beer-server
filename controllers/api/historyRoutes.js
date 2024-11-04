const router = require('express').Router();
const { User, History, Game, Player } = require('../../models');
const withAuth = require('../../utils/auth');
const handleError = require('../../utils/handleError')
const { log, info, warn, error } = require('@frenzie24/logger');

// create a new history
router.post('/', withAuth, async (req, res) => {
    console.log('attempting new history')
    try {
        const historyData = await History.create(req.body);

        res.status(200).json(historyData);
    } catch (err) {
        warn(req)
        error(err)
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {

    try {
      const historyData = await History.destroy({
        where: {
          id: req.params.id,
        },
      });

      if (!historyData) {

        warn(`No History found`);
        res.status(404).json({ message: 'No history found with this id!' });
        return;
      }
      log('History deleted', 'green');
      res.status(200).json(historyData);
    } catch (err) {
      warn('We ran into an error:')
      error(err);
      res.status(500).json(err);
    }
  });

router.get('/', async (req, res) => {

    try {
        const _id = Math.floor(req.query.id);
        log(`id: ${_id}`);
        // if _id is not an integer then exit
        if (!Number.isInteger(_id)) {
            warn(`Bad request: id invalid`); handleError(err, req.session.logged_in, res);

        }
        // find the history by id, include related historys and related user's name attribute

        info(`Attempting to retrieve history with id: ${_id}`)
        const historyData = await History.findByPk(_id, {
            //models to join to history
            include: [
                {
                    model: User,
                },
                {
                    model: Game,
                },
                {
                    model: Player,
                },


            ],
        });

        const history = historyData.get({ plain: true });
        return res.status(200).json(historyData);
        //  return handleError(`You dont belong here, ${history.User.first_name}.  Sending you to login.`, req.session.logged_in, res);

    } catch (err) {
        // we had an eror log the error and send a message to the client
        return handleError(err, req.session.logged_in, res);
    }
});

//update history
router.patch('/', withAuth, async (req, res) => {
    log('============================');
    info(`updating history id: ${req.query.id}`);
    log(req.body, 'red', 'bgWhite');
    // log(req.body.content)

    try {

        const _id = Math.floor(req.query.id);
        if (!Number.isInteger(_id)) {
            warn(`Bad request: id invalid`);
            return handleError(err, req.session.logged_in, res);

        }
        const history = await History.findByPk(_id)
        log(history)
        history.log = `${history.dataValues.log}|-*${req.body.log}`;
        history.date_last_updated = req.body.date_last_updated;
        //history.content = req.body.content;
        history.save();
        return res.status(200).json(history);

    } catch (err) {
        return handleError(err, req.session.logged_in, res);
    }
});

module.exports = router;