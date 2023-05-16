const Breweries = require("../models/Breweries");
const ValidationRule = require("./rule");
const { isEmpty } = require("../util/helpers");

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

class BreweryExistsValidationRule extends ValidationRule {
  validate(input) {
    return Breweries.has(input);
  }

  getErrorMessage () {
    return "Brewery does not exist";
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
  rules: { NotEmptyValidationRule, IsNotDuplicateBreweryValidationRule, BreweryExistsValidationRule },
  getRule,
  dictionary,
};
