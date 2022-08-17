const { APP_NAMESPACE, APP_NAME } = require('../../../config')
const dashboardView = (req, res) => {
  res.render('index', {
    locals: {
      title: `${APP_NAME} - Home`,
      APP_NAMESPACE,
      APP_NAME
    }
  });
}

module.exports = {
  dashboardView
}
