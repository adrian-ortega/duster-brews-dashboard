const ValidationRule = require("../rule");
const { isEmpty } = require("../../util/helpers");

class NotEmptyValidationRule extends ValidationRule {
  validate(input) {
    return !isEmpty(input);
  }
}

module.exports = NotEmptyValidationRule;
