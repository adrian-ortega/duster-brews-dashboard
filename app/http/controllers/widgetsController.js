const formidable = require("formidable");
const Taps = require("../../models/Taps");
const { ALLOWED_IMAGE_TYPES, FILE_UPLOADS_FOLDER, FILE_UPLOADS_FOLDER_PATH } = require("../../util");
const { respondWithJSON } = require("../../util/http");
const { moveUploadedFile } = require("../../util/files");

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {Object}
 */
const listWidgetsHandler = (req, res) => respondWithJSON(res, Taps.all())

/**
 * Validates that the file uploaded to imageUploadHandler meets
 * criteria
 * @param {PersistentFile} file 
 * @returns {Object & { isValid: Boolean, validName: Function }}
 */
const widgetImageFileUploadValidator = (file) => {
  const type = file.mimetype;
  const validTypes = Object.values(ALLOWED_IMAGE_TYPES);

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
  const FILE_KEY = "widget_image";

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
