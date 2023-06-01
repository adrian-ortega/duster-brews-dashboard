const { ValidationError } = require("./error");

/**
 * @var String name
 * @var String template
 * @var Dictionary dictionary
 */
class ValidationRule {
  constructor() {
    this.name = null;
    this.template = null;
    this.dictionary = null;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  /**
   * @TODO Set a template for the error message instead of overriding
   *       the getErroMessage method
   * @param {String} template
   * @returns
   */
  setTemplate(template) {
    this.template = template;
    return this;
  }

  setDictionary(dictionary) {
    this.dictionary = dictionary;
    return this;
  }

  getName() {
    return this.name;
  }

  getErrorMessage() {
    return `${this.getName()} is a required field.`;
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

  validate(input) {
    return typeof input !== "undefined";
  }

  reportError(input) {
    return new ValidationError(input, this);
  }
}

module.exports = ValidationRule;
