const fs = require("fs");
const log = require("./log");
const { parseJson, stringifyJson } = require("./helpers");

const moveUploadedFile = (sourcePath, destinationPath, flags) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destinationPath, { flags });
    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);
    readStream.pipe(writeStream);
  });
};

/**
 * @param {String} path
 * @returns {Boolean}
 */
const fileExists = (path) => {
  try {
    return fs.existsSync(path);
  } catch (err) {
    return false;
  }
};

/**
 * @param {String} path
 * @param {Object} data
 * @param {Function} parser
 * @returns {Boolean}
 */
const saveFile = (path, data = {}, parser = stringifyJson) => {
  try {
    fs.writeFileSync(path, parser(data, null, 4));
    return true;
  } catch (err) {
    log.error("saveFile Error:", {
      error: err.message,
      path,
      data,
    });
    return false;
  }
};

/**
 * @param {String} path
 * @param {*} defaultValue
 * @param {Function} parser
 * @returns {*}
 */
const loadFile = (path, defaultValue = {}, parser = parseJson) => {
  try {
    if (!fileExists(path)) {
      saveFile(path, defaultValue);
    }
    return parser(fs.readFileSync(path, "utf-8"));
  } catch (err) {
    log.error("loadFile Error:", {
      error: err.message,
      path,
    });
    return null;
  }
};

/**
 * @param {String} path
 * @returns {Boolean}
 */
const deleteFile = (path) => {
  try {
    fs.unlinkSync(path);
    return true;
  } catch (err) {
    log.error("deleteFile Error:", {
      error: err.message,
      path,
    });
    return false;
  }
};

module.exports = {
  moveUploadedFile,
  fileExists,
  saveFile,
  loadFile,
  deleteFile,
};
