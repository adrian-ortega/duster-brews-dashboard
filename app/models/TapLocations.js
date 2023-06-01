const path = require("path");
const ModelCollection = require("./Collection");

const TAP_LOCATION_DEFAULTS = {
  name: null,
  token: null,
  percentage: 0,
  active: false,
};

class TapLocationCollection extends ModelCollection {
  constructor() {
    super(path.resolve("storage/tap-locations.db.json"));
  }

  fillables() {
    return ["name", "token", "percentage", "active"];
  }

  sanitize(data) {
    return super.sanitize({ ...TAP_LOCATION_DEFAULTS, ...data });
  }
}

module.exports = new TapLocationCollection();
