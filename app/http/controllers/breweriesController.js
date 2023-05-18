const formidable = require("formidable");
const Breweries = require("../../models/Breweries");
const { validate } = require("../../validation");
const { respondWithJSON } = require("../../util/http");
const { updateItemPrimaryImage } = require("../../util/models");

const breweriesGetHandler = (req, res) => respondWithJSON(res, Breweries.all());

const breweriesFieldsHandler = (req, res) => {
  const { fields } = require("../../settings/brewery.fields.json");
  return respondWithJSON(res, fields);
};

const breweriesPostHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData, files) => {
    if (err) {
      return next(err);
    }

    const validationRules = {
      name: ["required", "uniqueBrewery:name"],
      image: ["optional:isValidImage"],
      id: ["optional:breweryExists"],
    };

    if (formData.id) {
      validationRules.name = ["required"];
    }

    const validator = validate({ ...formData, ...files }, validationRules);

    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }
    let brewery;
    if (formData.id) {
      brewery = Breweries.get(formData.id);
      brewery.name = formData.name;
    } else {
      brewery = Breweries.create({
        name: formData.name,
      });
    }

    if (files.image) {
      await updateItemPrimaryImage(brewery, files.image, Breweries);
    }

    return respondWithJSON(res, Breweries.get(brewery.id));
  });
};

module.exports = {
  breweriesGetHandler,
  breweriesFieldsHandler,
  breweriesPostHandler,
};
