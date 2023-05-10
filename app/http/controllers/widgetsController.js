const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { getWidgetItems } = require("../../api");
const { respondWithJSON } = require("../../util/http");
const { moveUploadedFile } = require("../../util/files");

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {Object}
 */
const listWidgetsHandler = (req, res) => {
  return getWidgetItems().then((items) => {
    return respondWithJSON(res, items);
  });
};

// MIME types definition
const WIDGET_ALLOWED_TYPES = {
  bmp: "image/bmp",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "text/xml-svg",
  tiff: "image/tiff",
  tif: "image/tiff",
};

/**
 * Validates that the file uploaded to imageUploadHandler meets
 * criteria
 * @param {PersistentFile} file 
 * @returns {Object & { isValid: Boolean, validName: Function }}
 */
const widgetImageFileUploadValidator = (file) => {
  const type = file.mimetype;
  const validTypes = Object.values(WIDGET_ALLOWED_TYPES);

  // @TODO add file size limit?
  const isValid = validTypes.indexOf(type) !== -1;

  return {
    isValid,
    validName: () => {
      return `${file.newFilename}.${file.originalFilename.split(".").pop()}`;
    },
  };
};

const imageUploadHandler = (req, res, next) => {
  const form = formidable();
  const FILE_UPLOADS_FOLDER = "images/uploads";
  const FILE_UPLOADS_FOLDER_PATH = path.resolve(
    path.join("public"),
    FILE_UPLOADS_FOLDER
  );
  const FILE_KEY = "widget_image";

  if (!fs.existsSync(FILE_UPLOADS_FOLDER_PATH)) {
    fs.mkdirSync(FILE_UPLOADS_FOLDER_PATH);
  }

  form.parse(req, async (err, data, files) => {
    if (err) {
      return next(err);
    }

    if (files[FILE_KEY] && !files[FILE_KEY].length) {
      try {
        const widgetImageUpload = files[FILE_KEY];
        const validator = widgetImageFileUploadValidator(widgetImageUpload);
        if (!validator.isValid) {
          return respondWithJSON(res.status(400), {
            status: "fail",
            message: "Not a valid file type",
          });
        }

        const uploadFilename = validator.validName();
        const paths = {
          public: `${FILE_UPLOADS_FOLDER}/${uploadFilename}`,
          server: `${FILE_UPLOADS_FOLDER_PATH}/${uploadFilename}`,
        };

        await moveUploadedFile(widgetImageUpload.filepath, paths.server);

        // @TODO save file once movefile uploaded
        // const widgetId = data.widget_id;
        // const widgetImageKey = data.widget_image_key;

        return respondWithJSON(res, {
          status: "success",
          image: paths.public,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      // @TODO multiple?
    }
  });
};

module.exports = {
  listWidgetsHandler,
  imageUploadHandler,
};
