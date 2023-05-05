const Settings = require("../../settings");
const formidable = require("formidable");
const { getWidgetItems } = require("../../api");
const { objectHasKey } = require("../../util/helpers");

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
  const IGNORED_KEYS = ["fields"];
  const form = formidable();
  form.parse(req, (err, data, files) => {
    if(err) {
      return next(err);
    }

    // Pull a fresh copy of the settings stored in the json file.
    //
    const settings = Settings.all();

    // Using only the keys from the already existing json file,
    // this will help prevent insertion of new keys.
    //
    Object.keys(settings).filter(k => !IGNORED_KEYS.includes(k)).forEach((k) => {
      if (objectHasKey(data, k)) {
        // @TODO sanitize
        settings[k] = data[k]
      }
    });

    // Update the settings file and respond
    Settings.save(settings);

    // @TODO remove this, it's temp for debug
    respondWithJSON(res, { settings, data, files });

  });
}

module.exports = {
  widgetsApiHandler,

  settingsGetHandler,
  settingsPostHandler
};
