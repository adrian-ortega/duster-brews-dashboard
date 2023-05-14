const { isEmpty } = require("../util/helpers");
const ValidationRule = require("./rule");

class NotEmptyValidationRule extends ValidationRule {
  validate(input) {
    return !isEmpty(input);
  }
}

const dictionary = [[NotEmptyValidationRule, ["required", "notEmpty"]]];

const getRule = (alias) => {
  for (let i = 0; i < dictionary.length; i++) {
    const [rule, aliases] = dictionary[i];
    if (aliases.includes(alias)) {
      return new rule();
    }
  }
  return false;
};

module.exports = {
  rules: { NotEmptyValidationRule },
  getRule,
  dictionary,
};
