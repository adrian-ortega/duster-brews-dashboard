const path = require("path");
const ModelCollection = require("./Collection");

const TAP_DEFAULTS = {
  brewery_id: null,
  style: null,
  name: null,
  media: [],
  
  
  gravity: { start: 0, end: 0 },
  abv: "0",
  ibu: "0"
};

class TapsCollection extends ModelCollection {
  constructor() {
    super(path.resolve("storage/taps.db.json"));
  }

  create(data) {
    return super.create({ ...TAP_DEFAULTS, ...data });
  }
}

module.exports = new TapsCollection();
