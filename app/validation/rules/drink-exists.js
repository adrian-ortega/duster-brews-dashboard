const Drinks = require("../../models/Drinks");
const ValidationRule = require("../rule");

class DrinkExistsValidationRule extends ValidationRule {
  validate(input) {
    return Drinks.has(input);
  }

  getErrorMessage() {
    return "Drink does not exist";
  }
}

module.exports = DrinkExistsValidationRule;
