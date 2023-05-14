const Validator = require("./validator");
module.exports = {
  validate(data, rules) {
    return new Validator().validate(data, rules);
  },
};
