const formidable = require("formidable");
const Locations = require("../../models/TapLocations");
const { validate } = require("../../validation");
const { objectHasKey } = require("../../util/helpers");
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

    let location = {};
    let status;

    if (formData.id) {
      status = "updated";
      location = Locations.get(formData.id);
      Locations.fillables().forEach((key) => {
        if (objectHasKey(formData, key)) {
          location[key] = formData[key];
        }
      });
      Locations.put(location);
    } else {
      status = "created";
      Locations.fillables().forEach((key) => {
        if (objectHasKey(formData, key)) {
          location[key] = formData[key];
        }
      });
      location = Locations.create(location);
    }

    return respondWithJSON(res, { status });
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
