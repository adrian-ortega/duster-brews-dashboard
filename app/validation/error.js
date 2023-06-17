const { objectHasMethod } = require("../util/helpers");

class ValidationError extends Error {
  constructor(input, rule) {
    super();
    this.name = "ValidationError";
    this.input = input;
    this.failed = true;
    this.field = objectHasMethod(rule, "getName") ? rule.getName() : null;
    this.message = objectHasMethod(rule, "getErrorMessage")
      ? rule.getErrorMessage(input)
      : null;
  }
}

class RuleNotFoundError extends ValidationError {
  constructor(message) {
    super(null, null);
    this.failed = false;
    this.message = message;
  }
}

module.exports = {
  RuleNotFoundError,
  ValidationError,
};
