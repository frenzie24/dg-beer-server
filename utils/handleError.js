const { warn, error } = require('@frenzie24/logger');
const handleError = (err, logged_in, res, next) => {
    warn('We ran into an error:')
    error(err);
    if (logged_in) {
        return res.redirect('/');/*.render('dashboard', {
            ...user,
            logged_in: true,
            dashboard: true
        });*/
    } else return res.status(404);

}

module.exports = handleError; //okurrr