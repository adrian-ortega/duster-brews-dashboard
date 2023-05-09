const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { getWidgetItems } = require("../../api");
const { respondWithJSON } = require("../../util/http");
const { moveUploadedFile } = require("../../util/files");

const listWidgetsHandler = (req, res) => {
  getWidgetItems().then((items) => {
    respondWithJSON(res, items);
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

const widgetImageFileValidator = (file) => {
  const type = file.mimetype;
  const validTypes = Object.values(WIDGET_ALLOWED_TYPES);
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
  const FILE_KEY = "widget-image";

  if (!fs.existsSync(FILE_UPLOADS_FOLDER_PATH)) {
    fs.mkdirSync(FILE_UPLOADS_FOLDER_PATH);
  }

  form.parse(req, async (err, data, files) => {
    if (err) {
      return next(err);
    }

    if (files[FILE_KEY] && !files[FILE_KEY].length) {
      try {
        const newWidgetImage = files[FILE_KEY];
        const validator = widgetImageFileValidator(newWidgetImage);
        if (!validator.isValid) {
          return respondWithJSON(res.status(400), {
            status: "fail",
            message: "Not a valid file type",
          });
        }

        const upload_filename = validator.validName();
        const paths = {
          public: `${FILE_UPLOADS_FOLDER}/${upload_filename}`,
          server: `${FILE_UPLOADS_FOLDER_PATH}/${upload_filename}`,
        };
        await moveUploadedFile(newWidgetImage.filepath, paths.server);

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
