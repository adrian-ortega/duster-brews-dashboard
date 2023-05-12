const ModelCollection = require("./Collection");

class BreweriesCollection extends ModelCollection {
    constructor() {
        super(path.resolve("storage/breweries.json"))
    }
}

module.exports = new BreweriesCollection();