const Settings = require("../../settings");
const formidable = require("formidable");
const { objectHasKey } = require("../../util/helpers");
const { respondWithJSON } = require("../../util/http");

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
    settingsGetHandler,
    settingsPostHandler
}