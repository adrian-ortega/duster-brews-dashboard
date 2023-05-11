const Settings = require("../../settings");
const formidable = require("formidable");
const { respondWithJSON } = require("../../util/http");
const {
  ALLOWED_IMAGE_TYPES,
  FILE_UPLOADS_FOLDER_PATH,
  FILE_UPLOADS_FOLDER,
} = require("../../util");
const { moveUploadedFile } = require("../../util/files");

const settingsGetHandler = (req, res) => respondWithJSON(res, Settings.all());

const settingsFieldProcessor = async (key, value, { fields }) => {
  const field = fields[key];

  const image = async (file) => {
    const filename = `${file.newFilename}.${file.originalFilename
      .split(".")
      .pop()}`;
    await moveUploadedFile(
      file.filepath,
      `${FILE_UPLOADS_FOLDER_PATH}/${filename}`
    );
    return `${FILE_UPLOADS_FOLDER}/${filename}`;
  };

  switch (field.type) {
    case "boolean":
    case "bool":
      return JSON.parse(JSON.stringify({ value })).value;
    case "image":
      return await image(value);
    default:
      return value;
  }
};

const settingsFieldValidator = (key, value, { fields }) => {
  const field = fields[key];
  switch (field.type) {
    case "image":
      return Object.values(ALLOWED_IMAGE_TYPES).indexOf(value.mimetype) !== -1;
    default:
      // @TODO add a not empty check as the default?
      return true;
  }
};

const settingsPostHandler = (req, res, next) => {
  const IGNORED_KEYS = ["fields", "categories"];
  const form = formidable();
  form.parse(req, (err, formData, files) => {
    if (err) {
      return next(err);
    }

    // Pull a fresh copy of the settings stored in the json file.
    //
    const settings = Settings.all();

    // Using only the keys from the already existing json file,
    // this will help prevent insertion of new keys.
    //
    Object.keys(settings)
      .filter((setting_key) => !IGNORED_KEYS.includes(setting_key))
      .forEach(async (setting_key) => {
        if (
          Object.hasOwnProperty.call(formData, setting_key) &&
          settingsFieldValidator(setting_key, formData[setting_key], settings)
        ) {
          settings[setting_key] = await settingsFieldProcessor(
            setting_key,
            formData[setting_key],
            settings
          );
        }
        if (
          Object.hasOwnProperty.call(files, setting_key) &&
          settingsFieldValidator(setting_key, files[setting_key], settings)
        ) {
          settings[setting_key] = await settingsFieldProcessor(
            setting_key,
            files[setting_key],
            settings
          );
          console.log(setting_key, settings[setting_key]);
        }
      });

    // Update the settings file and respond
    const saved = Settings.save({ ...settings });

    // @TODO remove this, it's temp for debug
    respondWithJSON(res, { settings, data: formData, files, saved });
  });
};

module.exports = {
  settingsGetHandler,
  settingsPostHandler,
};
