const ValidationError = require("./error");
const Dictionary = require("./dictionary");
const { objectHasKey } = require("../util/helpers");

class Validator {
  constructor() {
    this.rules = [];
    this.errors = [];
  }

  validate(data, rules = {}) {
    try {
      this.data = data;
      this.rules = Dictionary.parse(rules);
      const keys = Object.keys(this.rules);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = objectHasKey(data, key) ? data[key] : null;

        // @TODO make vars name human readable
        const name = keys[i];

        for (let r = 0; r < this.rules[key].length; r++) {
          const rule = this.rules[key][r];
          rule.setName(name).assert(value);
        }
      }
    } catch (e) {
      if (e instanceof ValidationError) {
        this.errors.push({
          name: e.field,
          message: e.message,
        });
      }
    }
    return this;
  }

  failed() {
    return this.errors.length > 0;
  }

  getErrors() {
    return [...this.errors];
  }

  getFirstError() {
    return this.failed() ? this.errors[0] : null;
  }
}

module.exports = {
  Validator
};
