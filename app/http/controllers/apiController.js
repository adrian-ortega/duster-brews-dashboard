const Settings = require("../../settings");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
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

const widgetImageFileValidator = (file) => {
  console.log(file);
  const type = file.type.split('/').pop();
  const validTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
  const isValid = validTypes.indexOf(type) !== -1;

  return {
    isValid
  }
}

const widgetsImageHandler = (req, res, next) => {
  const form = formidable();
  const upload_folder = path.resolve("public/images/uploads");
  console.log(upload_folder);
  const FILE_KEY = 'widget-image';

  form.parse(req, async (err, data, files) => {
    if(err) {
      return next(err);
    }

    if(files[FILE_KEY] && !files[FILE_KEY].length) {
      try {
        const newWidgetImage = files[FILE_KEY];
        if(!widgetImageFileValidator(newWidgetImage).isValid) {
          return respondWithJSON(res.status(400), { status: "fail", message: "Not a valid file type" });
        }
        
        const upload_file = fs.createWriteStream(`${upload_folder}/${newWidgetImage.originalFilename}`);
        const temp_folder = fs.createReadStream(newWidgetImage.filepath);

        console.log({ upload_file, temp_folder});

        return respondWithJSON(res, {
          status: "success",
          image: `/images/uploads/${newFileName}`
        })
      } catch (e) {
        console.log(e);
      }
    } else {
      // @TODO multiple?
    }

  });
}

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
  widgetsImageHandler,

  settingsGetHandler,
  settingsPostHandler
};
