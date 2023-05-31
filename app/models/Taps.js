const path = require("path");
const ModelCollection = require("./Collection");

const TAP_DEFAULTS = {
  brewery_id: null,
  style: null,
  name: null,
  media: [],
  active: false,
  
  gravity: { start: 0, end: 0 },
  abv: "0",
  ibu: "0"
};

class TapsCollection extends ModelCollection {
  constructor() {
    super(path.resolve("storage/taps.db.json"));
  }

  sanitize(data) {
    return super.sanitize({ ...TAP_DEFAULTS, ...data });
  }
}

module.exports = new TapsCollection();
