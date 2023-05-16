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

/**
 * @TODO move to helpers.js?
 * @param {Object|Array} a 
 * @returns {Object|Array}
 */
const sanitizedCopy = (a) => (isObject(a) ? { ...a } : isArray(a) ? [...a] : a);

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
    return this.data.items.find(item => item.id === id);
  }

  put(data) {
    this.refresh();
    this.data.items.push(sanitizedCopy(data));
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
    return this.data.items.some(item => item.id === id);
  }

  refresh() {
    return super.refresh(sanitizedCopy(MODEL_DEFAULTS));
  }
}

module.exports = ModelCollection;
