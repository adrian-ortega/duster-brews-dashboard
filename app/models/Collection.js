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
      const copied = sanitizedCopy(data);
      if (i !== -1) {
        this.data.items[i] = copied;
      } else {
        this.data.items.push(copied);
      }
    } else {
      this.create(data);
    }
    return this.save();
  }

  all() {
    this.refresh();
    return parseJson(JSON.stringify(this.data.items));
  }

  remove(id) {
    this.refresh();
    this.data.items = this.data.items.filter((t) => t.id !== id);
    this.save();
    return true;
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
