const path = require("path");
const fs = require("fs");

const ALLOWED_IMAGE_TYPES = {
  bmp: "image/bmp",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "text/xml-svg",
  tiff: "image/tiff",
  tif: "image/tiff",
};

const FILE_UPLOADS_FOLDER = "images/uploads";
const FILE_UPLOADS_FOLDER_PATH = path.resolve(
  path.join("public"),
  FILE_UPLOADS_FOLDER
);

if (!fs.existsSync(FILE_UPLOADS_FOLDER_PATH)) {
  fs.mkdirSync(FILE_UPLOADS_FOLDER_PATH);
}

module.exports = {
  ALLOWED_IMAGE_TYPES,
  FILE_UPLOADS_FOLDER,
  FILE_UPLOADS_FOLDER_PATH,
};
