const path = require("path");
const defaults = require("./defaults.json");
const JSONFileStorage = require("../util/storage");

module.exports = new JSONFileStorage(
  path.resolve("storage/settings.json"),
  defaults,
  true
);
