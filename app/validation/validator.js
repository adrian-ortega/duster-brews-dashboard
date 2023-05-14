const ValidationError = require("./error");
const { getRule } = require("./rules");
const { objectHasKey, isString, isArray } = require("../util/helpers");

const parseValidationRules = (rules) => {
  const ruleEntries = Object.entries(rules);
  const parsed = {};
  for (let i = 0; i < ruleEntries.length; i++) {
    let [key, rules] = ruleEntries[i];

    parsed[key] = [];

    if (isString(rules)) {
      rules = [rules];
    }

    if (isArray(rules)) {
      for (let r = 0; r < rules.length; r++) {
        parsed[key].push(getRule(rules[i]));
      }
    }
  }
  return parsed;
};

class Validator {
  constructor() {
    this.errors = [];
  }

  validate(data, rules = {}) {
    try {
      rules = parseValidationRules(rules);
      const keys = Object.keys(rules);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = objectHasKey(data, key) ? data[key] : null;
        const name = keys[i]; // make vasr name human readable
        for (let r = 0; r < rules[key].length; r++) {
          const rule = rules[key][r];
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

module.exports = Validator;