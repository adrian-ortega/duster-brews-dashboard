const ValidationRule = require("../rule");
const { ALLOWED_IMAGE_TYPES } = require("../../util");
const { isObject, objectHasKey } = require("../../util/helpers");

class IsValidImageFileValidationRule extends ValidationRule {
  validate(input) {
    return Object.values(ALLOWED_IMAGE_TYPES).indexOf(input.mimetype) !== -1;
  }

  getErrorMessage(input) {
    if (isObject(input)) {
      const filename = objectHasKey(input, "originalFilename")
        ? input.originalFilename
        : input.filename;
      return `'${filename}' is an invalid filetype.`;
    }
    return `Invalid filetype.`;
  }
}

module.exports = IsValidImageFileValidationRule;
