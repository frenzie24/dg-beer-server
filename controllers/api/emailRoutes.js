const router = require('express').Router();
const { User, Game, History, Player } = require('../../models');
const withAuth = require('../../utils/auth');
const handleError = require('../../utils/handleError')
const { log, info, warn, error } = require('@frenzie24/logger');

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/', withAuth, async (req, res) => {
    log("attempting email")
    log(req.body);
    const { to, subject, user_id } = req.body;
    log(req.session);

    const historyData = await History.findByPk(user_id);

    log(historyData)

    const history = historyData.get({ plain: true });
    log(history);
    const mailOptions = {
        from: 'process.env.EMAIL_USER',
        to,
        subject,
        text: JSON.stringify(history.log),
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: error.toString() });
        }
        res.status(200).json({ message: 'Email sent', info });
    });
});

module.exports = router;
