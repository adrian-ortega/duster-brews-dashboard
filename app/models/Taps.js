const path = require("path");
const ModelCollection = require("./Collection");

const TAP_DEFAULTS = {
  brewery_id: null,
  location_id: null,
  style: null,
  name: null,
  media: [],
  active: false,

  gravity_start: 0,
  gravity_end: 0,
  abv: 0,
  ibu: 0,
};

class TapsCollection extends ModelCollection {
  constructor() {
    super(path.resolve("storage/taps.db.json"));
  }

  fillables() {
    return [
      "abv",
      "active",
      "brewery_id",
      "location_id",
      "gravity_start",
      "gravity_end",
      "ibu",
      "name",
      "style",
    ];
  }

  sanitize(data) {
    return super.sanitize({ ...TAP_DEFAULTS, ...data });
  }
}

module.exports = new TapsCollection();
