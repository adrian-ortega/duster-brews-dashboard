class ValidationError extends Error {
  constructor(input, rule) {
    super();
    this.name = "ValidationError";
    this.input = input;
    this.failed = true;
    this.field = rule.getName();
    this.message = rule.getErrorMessage();
  }
}

module.exports = ValidationError;
