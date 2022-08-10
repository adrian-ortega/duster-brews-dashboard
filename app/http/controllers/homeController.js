const { APP_NAME } = require('../../../config')
module.exports = function (req, res) {
    res.send(`Welcome to ${APP_NAME}`)
}
