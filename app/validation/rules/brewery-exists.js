const Breweries = require("../../models/Breweries");
const ValidationRule = require("../rule");

class BreweryExistsValidationRule extends ValidationRule {
  validate(input) {
    return Breweries.has(input);
  }

  getErrorMessage() {
    return "Brewery does not exist";
  }
}

module.exports = BreweryExistsValidationRule;
