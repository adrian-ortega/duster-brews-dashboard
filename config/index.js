require('dotenv').config()

module.exports = {
    APP_NAME: process.env.APP_NAME || 'Brewing Dashboard',
    APP_NAMESPACE: 'DBDAPP',
    PORT: process.env.PORT || 8080,
    HOST: process.env.HOST || '0.0.0.0',
    DEBUG: process.env.DEBUG || false,
    BEERS_SPREADSHEET_ID: process.env.BEERS_SPREADSHEET_ID,
    BEERS_SPREADSHEET_RANGE: process.env.BEERS_SPREADSHEET_RANGE,
    PLAATO_SPREADSHEET_ID: process.env.PLAATO_SPREADSHEET_ID,
    PLAATO_SPREADSHEET_RANGE: process.env.PLAATO_SPREADSHEET_RANGE,
}
