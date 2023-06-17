const path = require("path");
const { ONE_MINUTE } = require("../../util/time");
const { objectHasKey, stringifyJson } = require("../../util/helpers");
const JSONFileStorage = require("../../util/storage");

class PlaatoCache {
  constructor() {
    // time to expire
    this.tte = ONE_MINUTE * 3;
    this.storage = new JSONFileStorage(
      path.resolve("storage/plaato.cache.json")
    );
    this.storage.parser = (data) => stringifyJson(data, {}, 0);
    this.items = [];
  }

  invalidate() {
    const keys = this.storage.keys();
    const now = new Date().getTime();
    for (let i = 0; i < keys.length; i++) {
      if (this.storage.data[keys[i]].ts - now > this.tte) {
        this.storage.remove(keys[i]);
      }
    }
    this.storage.save();
    return this;
  }

  create(id, values = {}) {
    const item = { ts: new Date().getTime(), id, ...values };
    this.storage.put(id, item);
    return item;
  }

  has(id, key = null) {
    if (!key) return this.storage.has(id);
    const items = this.storage.all();
    return objectHasKey(items, id) && objectHasKey(items[id], key);
  }

  get(id) {
    return this.storage.get(id);
  }

  set(id, data) {
    if (this.storage.has(id)) {
      const item = this.storage.get(id);
      this.storage.put(id, { ...item, ...data });
    } else {
      this.create(id, data);
    }
    return this;
  }
}

module.exports = PlaatoCache;
