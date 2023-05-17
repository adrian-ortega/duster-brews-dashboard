const Taps = require("../models/Taps");
const Breweries = require("../models/Breweries");
const ValidationRule = require("./rule");
const { isEmpty } = require("../util/helpers");
const { ALLOWED_IMAGE_TYPES } = require("../util")

class NotEmptyValidationRule extends ValidationRule {
  validate(input) {
    return !isEmpty(input);
  }
}

class IsNotDuplicateBreweryValidationRule extends ValidationRule {
  validate(input) {
    return !Breweries.has(input);
  }
}

class TapExistsValidationRule extends ValidationRule {
  validate(input) {
    return Taps.has(input);
  }

  getErrorMessage () {
    return "Tap does not exist";
  }
}

class BreweryExistsValidationRule extends ValidationRule {
  validate(input) {
    return Breweries.has(input);
  }

  getErrorMessage () {
    return "Brewery does not exist";
  }
}

class IsValidImageFileValidationRule extends ValidationRule {
  validate (input) {
    return Object.values(ALLOWED_IMAGE_TYPES).indexOf(input.mimetype) !== -1
  }

  getErrorMessage () {
    return `'${this.getName()}' is an invalid image file.`
  }
}

const dictionary = [
  [
    NotEmptyValidationRule,
    ["required", "notEmpty"]
  ],
  [
    IsNotDuplicateBreweryValidationRule,
    ["isNotDuplicateBrewery", "uniqueBrewery"],
  ],
  [
    BreweryExistsValidationRule,
    ["breweryExists"],
  ],
  [
    TapExistsValidationRule,
    ["tapExists"],
  ],
  [
    IsValidImageFileValidationRule,
    ["image", "isValidImage"]
  ],
];

const factory = (ruleClass, ...args) => {
  return new ruleClass(args);
};

const getRule = (alias) => {
  const dic = [...dictionary];
  for (let i = 0; i < dic.length; i++) {
    const [rule, aliases] = dic[i];
    if (aliases.includes(alias)) {
      return factory(rule);
    }
  }
  return false;
};

module.exports = {
  rules: {
    NotEmptyValidationRule,
    IsNotDuplicateBreweryValidationRule,
    BreweryExistsValidationRule,
    IsValidImageFileValidationRule
  },
  getRule,
  dictionary,
};
