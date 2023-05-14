const ValidationError = require("./error");

class ValidationRule {
  constructor() {
    this.name = null;
    this.template = null;
  }

  setTemplate(template) {
    this.template = template;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  getName() {
    return this.name;
  }

  check(input) {
    this.assert(input);
  }

  assert(input) {
    if (this.validate(input)) {
      return;
    }
    throw this.reportError(input);
  }

  getErrorMessage() {
    return `${this.getName()} is a required field.`;
  }

  validate(input) {
    return typeof input !== undefined;
  }

  reportError(input) {
    return new ValidationError(input, this);
  }
}

module.exports = ValidationRule;
