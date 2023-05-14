const formidable = require("formidable");
const Breweries = require("../../models/Breweries");
const { respondWithJSON } = require("../../util/http");
const { validate } = require("../../validation");

const breweriesGetHandler = (req, res) => respondWithJSON(res, Breweries.all());
const breweriesFieldsHandler = (req, res) => {
  respondWithJSON(res, [
    {
      label: "Name",
      name: "name",
      type: "text",
      value: null,
      required: true,
    },
    {
      label: "Logo",
      name: "logo",
      type: "image",
      value: null,
    },
  ]);
};

const fieldProcessor = async (key, value, { fields }) => {};

const fieldValidator = (data) => {
  return validate(data, {
    name: "required",
  });
};

const breweriesPostHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, (err, formData, files) => {
    if (err) {
      return next(err);
    }
    const validator = fieldValidator({ ...formData, ...files });
    if (validator.failed()) {
      const data = {
        status: 422,
        errors: validator.getErrors(),
      };
      return respondWithJSON(res, data, 422);
    }

    const brewery = Breweries.create({
      name: formData.name
    });
    
    return respondWithJSON(res, brewery);
  });
};

module.exports = {
  breweriesGetHandler,
  breweriesFieldsHandler,
  breweriesPostHandler,
};
