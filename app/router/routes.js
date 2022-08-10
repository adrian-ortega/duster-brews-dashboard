const { dashboardView } = require('../http/controllers/homeController')

module.exports = [
    {
        path: '/',
        handler: dashboardView,
        meta: {}
    }
]
