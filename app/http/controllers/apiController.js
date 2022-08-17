const { getWidgetItems } = require('../../api')
const respondWithJSON = (res, data, meta = {}) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ data, meta })
}

const widgetsApiView = (req, res) => {
  getWidgetItems().then((items) => {
    respondWithJSON(res, items)
  });
};

module.exports = {
  widgetsApiView
}