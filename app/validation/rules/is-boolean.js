const { isString } = require("../../util/helpers");
const ValidationRule = require("../rule");

class IsBooleanValidationRule extends ValidationRule {
  validate(input) {
    if (isString(input) && isNaN(input)) {
      return input.toLowerCase() === "false";
    }

    return (
      typeof input === "boolean" ||
      input instanceof Boolean ||
      parseInt(input, 10) > 0
    );
  }

  getErrorMessage() {
    return "Must be a boolean type.";
  }
}

module.exports = IsBooleanValidationRule;
