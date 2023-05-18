const {
  objectHasKey,
  parseJson,
  isObject,
  sanitizedCopy,
} = require("../util/helpers");
const { makeId } = require("../util/uuid");
const JSONFileStorage = require("../util/storage");

const MODEL_DEFAULTS = {
  items: [],
};

class ModelCollection extends JSONFileStorage {
  constructor(filepath) {
    super(filepath, sanitizedCopy(MODEL_DEFAULTS), true);
  }

  create(data) {
    const id = makeId();
    this.put({ id, ...data });
    return this.get(id);
  }

  get(id) {
    this.refresh();
    return this.data.items.find((item) => item.id === id);
  }

  put(data) {
    this.refresh();
    if (isObject(data) && objectHasKey(data, "id")) {
      const i = this.data.items.findIndex((m) => m.id === data.id);
      this.data.items[i] = sanitizedCopy(data);
    } else {
      this.data.items.push(sanitizedCopy(data));
    }
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

  has(id) {
    this.refresh();
    return this.data.items.some((item) => item.id === id);
  }

  refresh() {
    return super.refresh(sanitizedCopy(MODEL_DEFAULTS));
  }
}

module.exports = ModelCollection;
