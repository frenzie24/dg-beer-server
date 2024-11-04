const router = require('express').Router();
const { User, Game, History, Player } = require('../../models');
const withAuth = require('../../utils/auth');
const handleError = require('../../utils/handleError')
const { log, info, warn, error } = require('@frenzie24/logger');

// create a new player
router.post('/', withAuth, async (req, res) => {
    console.log('attempting new player')
    try {
        const playerData = await Player.create(req.body);
        info('New player created.')
        res.status(200).json(playerData);
    } catch (err) {
        warn(req)
        error(err)
        res.status(400).json(err);
    }
});

router.get('/', async (req, res) => {
    log('Players request');

    if (req.query.id) {
        log('Retrieving a singple player');
        try {
            const _id = Math.floor(req.query.id);
            log(`id: ${_id}`);
            // if _id is not an integer then exit
            if (!Number.isInteger(_id)) {
                warn(`Bad request: id invalid`); handleError(err, req.session.logged_in, res);

            }
            // find the player by id, include related players and related user's name attribute

            info(`Attempting to retrieve player with id: ${_id}`)
            const playerData = await Player.findByPk(_id, {
                //models to join to player
                include: [
                    {
                        model: User,
                    },
                    {
                        model: Game,
                    },
                ],
            });

            const player = playerData.get({ plain: true });

            return res.status(200).json(playerData);
        }
        catch (err) {
            return handleError(err, req.session.logged_in, res);
        }
    } else {
        try {
            // Get all users and JOIN with user data and comments

            const playersData = await Player.findAll({
                include: [{ model: Game }, {model: User}],
            });

            // Serialize data so the template can read it
            const users = playersData.map((post) => post.get({ plain: true }));

            log(users)
            // Pass serialized data and session flag into template

            // users.forEach(post => nextPostID = post.id > nextPostID ? post.id : nextPostID)

            return res.status(200).json(playersData);

        }
        catch (err) {
            return handleError(err, req.session.logged_in, res);
        }
    }

});
/*

old
router.get('/', withAuth, async (req, res) => {

    try {
        const _id = Math.floor(req.query.id);
        log(`id: ${_id}`);
        // if _id is not an integer then exit
        if (!Number.isInteger(_id)) {
            warn(`Bad request: id invalid`); handleError(err, req.session.logged_in, res);

        }
        // find the player by id, include related players and related user's name attribute

        info(`Attempting to retrieve player with id: ${_id}`)
        const playerData = await Post.findByPk(_id, {
            //models to join to player
            include: [
                {
                    model: User,
                    attributes: ['first_name', 'id'],
                }


            ],
        });

        const player = playerData.get({ plain: true });
        return handleError(`You dont belong here, ${player.User.first_name}.  Sending you to login.`, req.session.logged_in, res);

    } catch (err) {
        // we had an eror log the error and send a message to the client
        return handleError(err, req.session.logged_in, res);
    }
});
*/

//update player score
router.patch('/', withAuth, async (req, res) => {
    log('============================');
    info(`updating player id: ${req.query.id}`);
    log(req.body, 'red', 'bgWhite');
    // log(req.body.content)

    try {

        const _id = Math.floor(req.query.id);
        if (!Number.isInteger(_id)) {
            warn(`Bad request: id invalid`);
            return handleError(err, req.session.logged_in, res);

        }
        const player = await Player.findByPk(_id)

        player.score = req.body.score;
        player.save();
        return res.status(200).json(player);

    } catch (err) {
        return handleError(err, req.session.logged_in, res);
    }
});

module.exports = router;