const formidable = require("formidable");
const Locations = require("../../models/TapLocations");
const { validate } = require("../../validation");
const { respondWithJSON } = require("../../util/http");

const locationsGetHandler = (req, res) => respondWithJSON(res, Locations.all());
const locationsFieldsHandler = (req, res) => {
  const { fields } = require("../../settings/location.fields.json");
  return respondWithJSON(res, fields);
};
const locationsPostHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData) => {
    if (err) {
      next(err);
    }

    const validator = validate({ ...formData }, { name: ["required"] });

    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }

    let location;
    if (formData.id) {
      location = Locations.get(formData.id);
      location.name = formData.name;
      Locations.put(location);
    } else {
      location = Locations.create({ name: formData.name });
    }

    return respondWithJSON(res, Locations.get(location.id));
  });
};
const locationsDestroyHandler = (req, res) => {
  const { id } = req.params;
  if (!Locations.has(id)) {
    return respondWithJSON(
      res,
      { status: "error", message: "Tap Location not found" },
      404
    );
  }

  Locations.remove(id);
  return respondWithJSON(res, { status: "Success", id });
};

module.exports = {
  locationsGetHandler,
  locationsFieldsHandler,
  locationsPostHandler,
  locationsDestroyHandler,
};
