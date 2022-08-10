const routes = require('./routes');
module.exports = (app) => routes.forEach((route) => app.get(route.path, route.handler));
