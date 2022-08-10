require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8080,
    HOST: process.env.HOST || '0.0.0.0'
}
