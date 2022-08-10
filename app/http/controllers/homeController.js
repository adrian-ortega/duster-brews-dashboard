const { APP_NAME } = require('../../../config')

const dashboardView = (req, res) => {
    res.render('pages/home', {
        APP_NAME
    });
}

module.exports = {
    dashboardView
}
