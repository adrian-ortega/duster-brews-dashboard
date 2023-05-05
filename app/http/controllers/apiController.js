const Settings = require("../../settings");
const formidable = require("formidable");
const { getWidgetItems } = require("../../api");

const respondWithJSON = (res, data, meta) => {
  res.setHeader("Content-Type", "application/json");
  const response = { data };
  if (meta) {
    response.meta = meta;
  }
  res.json(response);
};

const widgetsApiHandler = (req, res) => {
  getWidgetItems().then((items) => {
    respondWithJSON(res, items);
  });
};

const settingsGetHandler = (req, res) => respondWithJSON(res, Settings.all());

const settingsPostHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    if(err) {
      return next(err);
    }
    respondWithJSON(res, { fields, files });
  });
}

module.exports = {
  widgetsApiHandler,

  settingsGetHandler,
  settingsPostHandler
};
