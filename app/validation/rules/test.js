const ValidationRule = require("../rule");

class TestValidationRule extends ValidationRule {
    validate () {
        return true;
    }
}

module.exports = TestValidationRule;