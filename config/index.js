require('dotenv').config()

module.exports = {
    APP_NAME: process.env.APP_NAME || 'Brewing Dashboard',
    PORT: process.env.PORT || 8080,
    HOST: process.env.HOST || '0.0.0.0'
}
