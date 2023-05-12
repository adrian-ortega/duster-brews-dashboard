const path = require("path");
const ModelCollection = require("./Collection");

class ItemsCollection extends ModelCollection {
    constructor() {
        super(path.resolve("storage/items.json"))
    }
}

module.exports = new ItemsCollection();