const ValidationRule = require("../rule");
const { isEmpty, objectHasKey } = require("../../util/helpers");
const ValidationError = require("../error");

class IsOptionalValidationRule extends ValidationRule {
  constructor(parsedRules) {
    super();
    this.rules = parsedRules.split(",");
    this.errorMessage = null;
  }

  validate(input) {
    if (isEmpty(input) || (objectHasKey(input, "size") && input.size === 0)) {
      return true;
    }

    try {
      const name = this.name;
      const parsedRules = this.dictionary.parse({ [name]: this.rules });
      const rules = parsedRules[name];

      for (let i = 0; i < rules.length; i++) {
        rules[i].setName(name).assert(input);
      }

      return true;
    } catch (e) {
      if (e instanceof ValidationError) {
        this.errorMessage = e.message;
      }

      return false;
    }
  }

  getErrorMessage() {
    return this.errorMessage ?? "Failed some rules";
  }
}

module.exports = IsOptionalValidationRule;
