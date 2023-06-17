const path = require("path");
const ModelCollection = require("./Collection");

const TAP_DEFAULTS = {
  name: null,
  token: null,
  percentage: 0,
  keg_date: null,
  active: false,
};

class Taps extends ModelCollection {
  constructor() {
    super(path.resolve("storage/taps.db.json"));
  }

  fillables() {
    return ["name", "token", "percentage", "keg_date", "active"];
  }

  sanitize(data) {
    return super.sanitize({ ...TAP_DEFAULTS, ...data });
  }
}

module.exports = new Taps();
