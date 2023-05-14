const {
  objectHasKey,
  parseJson,
  isObject,
  isArray,
} = require("../util/helpers");
const { makeId } = require("../util/uuid");
const JSONFileStorage = require("../util/storage");

const MODEL_DEFAULTS = {
  items: [],
};

const sanitizedCopy = (a) => (isObject(a) ? { ...a } : isArray(a) ? [...a] : a);

class ModelCollection extends JSONFileStorage {
  constructor(filepath) {
    const defaults = { ...MODEL_DEFAULTS };
    super(filepath, defaults, true);
    this.defaults = defaults;
  }

  create(data) {
    const id = makeId();
    this.put(id, data);
    return this.get(id);
  }

  get(id) {
    this.refresh();
    return objectHasKey(this.data.items, id) ? this.data.items[id] : null;
  }

  put(id_or_items, value) {
    this.refresh();
    
    if (isArray(id_or_items) && objectHasKey(id_or_items[0], "id")) {
      const values = [...id_or_items];
      const ids = values.map(({ id }) => id);
      ids.forEach((id, i) => {
        this.data.items[id] = sanitizedCopy(values[i]);
      });
    } else {
      this.data.items[id_or_items] = sanitizedCopy(value);
    }
    console.log(this.data.items);
    return this.save();
  }

  all() {
    this.refresh();
    return parseJson(JSON.stringify(this.data.items));
  }

  remove(id) {
    this.refresh();
    if (objectHasKey(this.data.items, id)) {
      delete this.data.items[id];
    }
    this.save();
    return !objectHasKey(this.data.items, id);
  }

  has(id_or_ids) {
    let has;
    this.refresh();
    if (isArray(id_or_ids)) {
      has = Object.entries(this.data.items).find((item) =>
        id_or_ids.includes(item.id)
      );
    } else {
      has = objectHasKey(this.data.items, id_or_ids);
    }
    return has;
  }

  refresh() {
    return super.refresh(this.defaults);
  }
}

module.exports = ModelCollection;
