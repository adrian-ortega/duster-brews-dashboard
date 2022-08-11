const { dashboardView } = require('../http/controllers/homeController')
const { widgetsView } = require('../http/controllers/apiController')

module.exports = [
    {
        path: '/',
        handler: dashboardView
    },
    {
        path: '/api/widgets',
        handler: widgetsView
    }
]
