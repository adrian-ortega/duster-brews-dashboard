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

  create(data) {
    return super.create({ ...TAP_LOCATION_DEFAULTS, ...data });
  }
}

module.exports = new TapLocationCollection();
