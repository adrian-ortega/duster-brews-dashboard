const ValidationRule = require("../rule");

class IsNumericValidationRule extends ValidationRule {
  validate(input) {
    return isNaN(input) === false;
  }

  getErrorMessage() {
    return "Must be numeric.";
  }
}

module.exports = IsNumericValidationRule;
