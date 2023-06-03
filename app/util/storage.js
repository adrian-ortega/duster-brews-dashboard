const {
  parseJson,
  isArray,
  objectHasKey,
  isObject,
  isFunction,
} = require("./helpers");
const { saveFile, loadFile } = require("./files");

class JSONFileStorage {
  constructor(path, data = {}, autoload = false) {
    this.path = path;
    this.data = data;
    this.parser = JSON.stringify;
    if (autoload) this.autoload(autoload);
  }

  keys() {
    this.refresh();
    return Object.keys(this.data);
  }

  get(id, defaultValue = null) {
    this.refresh();
    return objectHasKey(this.data, id) ? this.data[id] : defaultValue;
  }

  put(id, value) {
    this.refresh();
    const sanitize = (a) => (isObject(a) ? { ...a } : isArray(a) ? [...a] : a);
    if (isArray(id) && objectHasKey(id[0], "id")) {
      const values = [...id];
      const ids = values.map(({ id }) => id);
      ids.forEach((id, i) => {
        this.data[id] = sanitize(values[i]);
      });
    } else {
      this.data[id] = sanitize(value);
    }

    return this.save();
  }

  all() {
    this.refresh();
    return parseJson(JSON.stringify(this.data));
  }

  remove(id) {
    this.refresh();
    if (objectHasKey(this.data, id)) {
      delete this.data[id];
    }
    return !objectHasKey(this.data, id);
  }

  has(id_or_ids) {
    let has;
    this.refresh();
    if (isArray(id_or_ids)) {
      has = Object.entries(this.data).find((item) =>
        id_or_ids.includes(item.id)
      );
    } else {
      has = objectHasKey(this.data, id_or_ids);
    }
    this.save();
    return has;
  }

  autoload(autoloadCallback) {
    if (!this.autoloaded) {
      const defaultData = this.data;
      this.data = loadFile(this.path, defaultData);
      if (!isObject(this.data) || this.data === null) {
        this.data = defaultData;
      }
      if (isFunction(autoloadCallback)) {
        autoloadCallback(this);
      }
      this.autoloaded = true;
    }
  }

  refresh(defaultValue = {}) {
    this.data = loadFile(this.path, defaultValue);
    if (!isObject(this.data) || this.data === null) {
      this.data = defaultValue;
    }
    return true;
  }

  save(data) {
    if (!data) data = this.data;
    return saveFile(this.path, data, this.parser);
  }
}

module.exports = JSONFileStorage;
