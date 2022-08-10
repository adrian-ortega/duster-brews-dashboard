const { APP_NAME } = require('../../../config')
module.exports = function (req, res) {
    res.render('pages/home', {
        APP_NAME
    });
}
