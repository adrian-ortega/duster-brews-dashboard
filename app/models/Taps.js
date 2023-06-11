const path = require("path");
const ModelCollection = require("./Collection");

const TAP_DEFAULTS = {
  name: null,
  token: null,
  percentage: 0,
  active: false,
};

class Taps extends ModelCollection {
  constructor() {
    super(path.resolve("storage/taps.db.json"));
  }

  fillables() {
    return ["name", "token", "percentage", "active"];
  }

  sanitize(data) {
    return super.sanitize({ ...TAP_DEFAULTS, ...data });
  }
}

module.exports = new Taps();
