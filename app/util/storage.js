const log = require("./log");
const fs = require("fs");
const { parseJson, isArray, objectHasKey, isObject } = require("./helpers");

class JSONFileStorage {
  constructor(path, data = {}, autoload = false) {
    this.path = path;
    this.data = data;
    if (autoload) this.autoload();
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

  autoload() {
    if (!this.autoloaded) {
      const defaultData = this.data;
      this.data = JSONFileStorage.loadFile(this.path, defaultData);
      if (!isObject(this.data) || this.data === null) {
        this.data = defaultData;
      }
      this.autoloaded = true;
    }
  }

  refresh(defaultValue = {}) {
    this.data = JSONFileStorage.loadFile(this.path);
    if (!isObject(this.data) || this.data === null) {
      this.data = defaultValue;
    }
    return true;
  }

  save(data) {
    if(!data) data = this.data;
    return JSONFileStorage.saveFile(this.path, data);
  }

  static fileExists(path) {
    try {
      return fs.existsSync(path);
    } catch (err) {
      return false;
    }
  }

  static saveFile(path, data = {}) {
    try {
      fs.writeFileSync(path, JSON.stringify(data, null, 4));
      return true;
    } catch (err) {
      log.error("JSONFileManager.saveFile Error:", {
        error: err.message,
        path,
        data,
      });
      return false;
    }
  }

  static loadFile(path, defaultValue = {}) {
    try {
      if (!JSONFileStorage.fileExists(path)) {
        JSONFileStorage.saveFile(path, defaultValue);
      }
      return parseJson(fs.readFileSync(path, "utf-8"));
    } catch (err) {
      log.error("JSONFileManager.loadFile Error:", {
        error: err.message,
        path,
      });
      return null;
    }
  }

  static deleteFile(path) {
    try {
      fs.unlinkSync(path);
      return true;
    } catch (err) {
      log.error("JSONFileManager.deleteFile Error:", {
        error: err.message,
        path,
      });
      return false;
    }
  }
}

module.exports = JSONFileStorage;
