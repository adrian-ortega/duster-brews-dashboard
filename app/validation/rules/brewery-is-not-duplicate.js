const Breweries = require("../../models/Breweries");
const ValidationRule = require("../rule");
const { slugify } = require("../../util/helpers");

class IsNotDuplicateBreweryValidationRule extends ValidationRule {
  constructor(key) {
    super();
    this.key = key;
  }

  validate(input) {
    if (this.key) {
      const breweries = Breweries.all();

      for (let i = 0; i < breweries.length; i++) {
        if (
          this.prepareValue(input) === this.prepareValue(breweries[i][this.key])
        ) {
          return false;
        }
      }

      return true;
    }

    return !Breweries.has(input);
  }

  prepareValue(value) {
    switch (this.key) {
      case "name":
        return slugify(value);
      default:
        return value;
    }
  }

  getErrorMessage() {
    return this.key
      ? `A brewery already exists with that key (${this.key})`
      : "Brewery already exists";
  }
}

module.exports = IsNotDuplicateBreweryValidationRule;
