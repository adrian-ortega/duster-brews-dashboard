const Taps = require("../../models/Taps");
const ValidationRule = require("../rule");

class TapExistsValidationRule extends ValidationRule {
  validate(input) {
    return Taps.has(input);
  }

  getErrorMessage() {
    return "Tap does not exist";
  }
}

module.exports = TapExistsValidationRule;
