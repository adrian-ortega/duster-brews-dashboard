const ValidationRule = require("../rule");

class TestValidationRule extends ValidationRule {
  validate() {
    return true;
  }

  getErrorMessage() {
    return "Should never fail";
  }
}

module.exports = TestValidationRule;
