const Settings = require("../../settings");
const formidable = require("formidable");
const { validate } = require("../../validation");
const { respondWithJSON } = require("../../util/http");
const { FILE_UPLOADS_FOLDER_PATH, FILE_UPLOADS_FOLDER } = require("../../util");
const { moveUploadedFile } = require("../../util/files");
const { objectHasKey, isString } = require("../../util/helpers");

const settingsGetHandler = (req, res) => {
  return respondWithJSON(res, {
    values: Settings.all(),
    fields: require("../../settings/fields.json"),
    categories: require("../../settings/categories.json"),
  });
};

const settingsPostHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData, files) => {
    if (err) {
      return next(err);
    }

    const validationRules = {
      burn_in_guard_refresh_rate: ["isNumeric"],
      enable_plaato: ["boolean"],
      refresh_rate: ["isNumeric"],
      logo: ["optional:isValidImage"],
    };

    const validator = validate({ ...formData, ...files }, validationRules);
    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }

    const settings = Settings.all();
    let updated = false;
    const fields = Object.entries(require("../../settings/fields.json")).map(
      ([name, field]) => ({ name, ...field })
    );
    const entries = Object.entries({ ...formData, ...files });
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const entry = entries.find(([id]) => id === field.name);
      let value = entry ? entry[1] : null;
      if (field.type === "boolean") {
        value =
          isNaN(value) && isString(value)
            ? value.toLowerCase() === "true"
            : parseInt(value, 10) > 0;
      }

      if (field.type === "number") {
        value = parseInt(value, 10);
      }

      if (field.type === "image") {
        if (objectHasKey(value, "size") && value.size === 0) {
          value = undefined;
        } else {
          const file = value;
          const ext = file.originalFilename.split(".").pop();
          const filename = `${file.newFilename}.${ext}`;
          try {
            await moveUploadedFile(
              file.filepath,
              `${FILE_UPLOADS_FOLDER_PATH}/${filename}`
            );
            value = `/${FILE_UPLOADS_FOLDER}/${filename}`;
          } catch (e) {
            //
            console.log(e);
          }
        }
      }

      console.log({ name: field.name, old: settings[field.name], new: value });

      if (value !== undefined && settings[field.name] !== value) {
        updated = true;
        settings[field.name] = value;
      }
    }

    Settings.save(settings);

    return respondWithJSON(res, {
      updated,
      values: Settings.all(),
      fields: require("../../settings/fields.json"),
      categories: require("../../settings/categories.json"),
    });
  });
};

module.exports = {
  settingsGetHandler,
  settingsPostHandler,
};
