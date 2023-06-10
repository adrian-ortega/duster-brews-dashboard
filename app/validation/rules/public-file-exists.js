const ValidationRule = require("../rule");
const path = require("path");
const { fileExists } = require("../../util/files");

class PublicFileExistsValidationRule extends ValidationRule {
  validate(input) {
    return fileExists(path.join(path.resolve("public"), input));
  }

  getErrorMessage() {
    return `File does not exist`;
  }
}

module.exports = PublicFileExistsValidationRule;
