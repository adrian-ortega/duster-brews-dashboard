const path = require("path");
const ModelCollection = require("./Collection");

const BREWERY_DEFAULTS = {
  name: null,
  media: [],
};

class BreweriesCollection extends ModelCollection {
  constructor() {
    super(path.resolve("storage/breweries.db.json"));
  }

  fillables() {
    return ["name"];
  }

  sanitize(data) {
    return super.sanitize({ ...BREWERY_DEFAULTS, ...data });
  }
}

module.exports = new BreweriesCollection();
