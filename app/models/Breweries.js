const path = require("path");
const ModelCollection = require("./Collection");

const BREWERY_DEFAULTS = {
    name: null,
    media: []
}

class BreweriesCollection extends ModelCollection {
    constructor() {
        super(path.resolve("storage/breweries.db.json"))
    }

    create (data) {
        return super.create({ ...BREWERY_DEFAULTS, ...data });
    }
}

module.exports = new BreweriesCollection();