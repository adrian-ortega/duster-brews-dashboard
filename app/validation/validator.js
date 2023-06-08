const Dictionary = require("./dictionary");
const { RuleNotFoundError, ValidationError } = require("./error");
const { objectHasKey } = require("../util/helpers");

class Validator {
  constructor() {
    this.rules = [];
    this.errors = [];
    this.currentRuleName = null;
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
        this.currentRuleName = keys[i];

        for (let r = 0; r < this.rules[key].length; r++) {
          const rule = this.rules[key][r];
          rule.setName(this.currentRuleName).assert(value);
        }
      }
    } catch (e) {
      if (e instanceof RuleNotFoundError || e instanceof ValidationError) {
        this.errors.push({
          name: this.currentRuleName,
          type: e instanceof RuleNotFoundError ? "not-found" : "validation",
          message: e.message,
        });
      } else {
        this.errors.push({
          name: this.currentRuleName,
          type: "generic",
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
  Validator,
};
