const path = require("path");
const ModelCollection = require("./Collection");

const ITEM_DEFAULTS = {
    brewery_id: null,
    style: null,
    name: null,
    media: [],
    background_image: null,
    brewery: "Brews",
    brewery_image: "",
    gravity: { start: 0, end: 0 },
    abv: "0",
    ibu: "0",
    keg: {
        keg_name: "",
        id: 'Ale1',
        percent_beer_left: 0,
        abv: "0",
        volume_unit: "gal",
        keg_date: "",
        remaining: "",
        max_keg_volume: 100,
        last_pour: 0, pouring: 0
    }
};

class ItemsCollection extends ModelCollection {
    constructor() {
        super(path.resolve("storage/items.db.json"))
    }

    create(data) {
        return super.create({ ...ITEM_DEFAULTS, ...data })
    }
}

module.exports = new ItemsCollection();