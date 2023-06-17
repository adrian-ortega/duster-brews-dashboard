const {
  objectHasKey,
  parseJson,
  stringifyJson,
  isObject,
  sanitizedCopy,
  isArray,
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

  sanitize(item) {
    return sanitizedCopy(item);
  }

  put(data) {
    this.refresh();
    const isValidItem = (a) => isObject(a) && objectHasKey(a, "id");
    const putItem = (item) => {
      const i = this.data.items.findIndex((m) => m.id === item.id);
      const copied = this.sanitize(item);
      if (i !== -1) {
        this.data.items[i] = copied;
      } else {
        this.data.items.push(copied);
      }
    };
    if (isValidItem(data)) {
      putItem(data);
    } else if (isArray(data) && data.every(isValidItem)) {
      data.forEach(putItem);
    } else {
      this.create(data);
    }
    return this.save();
  }

  all() {
    this.refresh();
    return parseJson(stringifyJson(this.data.items));
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

  fillables() {
    return ["id"];
  }
}

module.exports = ModelCollection;
