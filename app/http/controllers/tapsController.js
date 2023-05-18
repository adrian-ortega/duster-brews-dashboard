const formidable = require("formidable");
const Taps = require("../../models/Taps");
const Breweries = require("../../models/Breweries");
const { validate } = require("../../validation");
const { respondWithJSON } = require("../../util/http");
const { updateItemPrimaryImage } = require("../../util/models");

const tapsGetHandler = (req, res) => respondWithJSON(res, Taps.all());

const tapsGetFieldsHandler = (req, res) => {
  let { fields } = require("../../settings/tap.fields.json");
  const breweryOptions = Breweries.all().map((brewery) => {
    return {
      value: brewery.id,
      text: brewery.name,
    };
  });
  fields = fields.map((field) => {
    if (field.name === "brewery_id") {
      field.options = breweryOptions;
    }
    return field;
  });
  return respondWithJSON(res, fields);
};

const tapsPostHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData, files) => {
    if (err) {
      return next(err);
    }
    const validationRules = {
      id: ["optional:tapExists"],
      brewery_id: ["required", "breweryExists"],
      name: ["required"],
      image: ["optional:isValidImage"],
      style: ["required"],
    };

    const validator = validate({ ...formData, ...files }, validationRules);

    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }
    let tap;
    if (formData.id) {
      tap = Taps.get(formData.id);
      tap.brewery_id = formData.brewery_id;
      tap.name = formData.name;
      tap.style = formData.style;
    } else {
      tap = Taps.create({
        brewery_id: formData.brewery_id,
        name: formData.name,
        style: formData.style,
      });
    }

    if (files.image) {
      await updateItemPrimaryImage(tap, files.image, Taps);
    }

    return respondWithJSON(res, tap);
  });
};

const tapsMediaHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData, files) => {
    if (err) {
      next(err);
    }
    const validator = validate(
      { ...formData, ...files },
      {
        media: ["required", "isValidImage"],
        tap_id: ["required", "tapExists"],
      }
    );
    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }

    await updateItemPrimaryImage(Taps.get(formData.tap_id), files.media, Taps);

    return respondWithJSON(res, {
      status: "success",
      image: Taps.get(formData.tap_id).media[0],
    });
  });
};

module.exports = {
  tapsGetHandler,
  tapsGetFieldsHandler,
  tapsPostHandler,
  tapsMediaHandler,
};
