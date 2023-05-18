const { isArray, isString } = require("../util/helpers");
const TestValidationRule = require("./rules/test");
const NotEmptyValidationRule = require("./rules/not-empty");
const IsOptionalValidationRule = require("./rules/optional");
const IsNotDuplicateBreweryValidationRule = require("./rules/brewery-is-not-duplicate");
const BreweryExistsValidationRule = require("./rules/brewery-exists");
const TapExistsValidationRule = require("./rules/tap-exists");
const IsValidImageFileValidationRule = require("./rules/file-valid-image");

class Dictionary {
  constructor() {
    this.rules = [];
  }

  addRule(rule, alias = []) {
    this.rules.push([rule, alias]);
    return this;
  }

  factory(ruleClass, ...args) {
    return new ruleClass(...args).setDictionary(this);
  }

  parse(rules) {
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
          let rule = rules[r];
          let args = [];

          if (rule.indexOf(":") !== -1) {
            const [ruleName, ...ruleArgs] = rule.split(":");
            rule = ruleName;
            args = ruleArgs.map((ra) => ra.trim());
          }

          const ruleInstance = this.getRule(rule, args);

          if (ruleInstance) {
            parsed[key].push(ruleInstance);
          }
        }
      }
    }
    return parsed;
  }

  getRule(alias, args) {
    const rules = this.rules;

    for (let i = 0; i < rules.length; i++) {
      const [rule, aliases] = rules[i];

      if (aliases.includes(alias)) {
        return this.factory(rule, ...args);
      }
    }

    return false;
  }
}

module.exports = (() => {
  const dic = new Dictionary();

  dic.addRule(TestValidationRule, ["empty", "test"]);
  dic.addRule(NotEmptyValidationRule, ["required", "notEmpty"]);
  dic.addRule(IsOptionalValidationRule, ["optional", "isOptional"]);
  dic.addRule(IsNotDuplicateBreweryValidationRule, [
    "isNotDuplicateBrewery",
    "uniqueBrewery",
  ]);
  dic.addRule(BreweryExistsValidationRule, ["breweryExists"]);
  dic.addRule(TapExistsValidationRule, ["tapExists"]);
  dic.addRule(IsValidImageFileValidationRule, ["image", "isValidImage"]);

  return dic;
})();
