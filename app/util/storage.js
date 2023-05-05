const log = require("./log");
const fs = require("fs");
const { parseJson, isArray, objectHasKey, isObject } = require("./helpers");

class JSONFileStorage {
  constructor(path, data = {}, saveAndLoad = false) {
    this.path = path;
    this.data = data;

    if (saveAndLoad) {
      this.fileRefresh(data);
    }
  }

  get(id, defaultValue = null) {
    this.fileRefresh();
    return objectHasKey(this.data, id) ? this.data[id] : defaultValue;
  }

  put(id, value) {
    this.fileRefresh();
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

    return this.fileSave();
  }

  all() {
    this.fileRefresh();
    return parseJson(JSON.stringify(this.data));
  }

  remove(id) {
    this.fileRefresh();
    if (objectHasKey(this.data, id)) {
      delete this.data[id];
    }
    return !objectHasKey(this.data, id);
  }

  has(id_or_ids) {
    let has;
    this.fileRefresh();
    if (isArray(id_or_ids)) {
      has = Object.entries(this.data).find((item) =>
        id_or_ids.includes(item.id)
      );
    } else {
      has = objectHasKey(this.data, id_or_ids);
    }
    this.fileSave();
    return has;
  }

  fileRefresh(defaultValue = {}) {
    this.data = this.loadFile(this.path);
    if (!isObject(this.data) || this.data === null) {
      this.data = defaultValue;
    }
    return true;
  }

  fileSave() {
    return this.saveFile(this.path, this.data);
  }

  static fileExists(path) {
    try {
      if (fs.fileExists(path)) return true;
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

  static loadFile(path) {
    try {
      if (!JSONFileStorage.fileExists(path)) {
        JSONFileStorage.saveFile(path);
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
