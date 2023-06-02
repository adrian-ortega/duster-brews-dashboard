const formidable = require("formidable");
const Taps = require("../../models/Taps");
const Breweries = require("../../models/Breweries");
const Locations = require("../../models/TapLocations");
const tapTransformer = require("../transformers/tap-transformer");
const { validate } = require("../../validation");
const { isString, objectHasKey } = require("../../util/helpers");
const { respondWithJSON } = require("../../util/http");
const { updateItemPrimaryImage } = require("../../util/models");

const tapsGetHandler = async (req, res) => {
  try {
    const taps = await Promise.all(Taps.all().map(tapTransformer));
    return respondWithJSON(res, taps);
  } catch (e) {
    return respondWithJSON(res, e, 500);
  }
};

const tapsGetFieldsHandler = (req, res) => {
  let { fields } = require("../../settings/tap.fields.json");
  const locationOptions = Locations.all().map((location) => {
    return {
      value: location.id,
      text: location.name,
    };
  });
  const breweryOptions = Breweries.all().map((brewery) => {
    return {
      value: brewery.id,
      text: brewery.name,
    };
  });
  fields = fields.map((field) => {
    if (field.name === "brewery_id") {
      field.options = breweryOptions;
      if (breweryOptions.length === 0) {
        const createLink = `<a class="route-link" data-route="add-brewery">Create one</a>`;
        const genLink = `<a class="route-link" data-route="generate-breweries">auto generate<a></a>`;
        field.help = `⚠️ ${createLink} or ${genLink} ⚠️`;
      }
    }
    if (field.name === "location_id") {
      field.options = [{ value: "-1", text: "N/A" }, ...locationOptions];
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
    let tap = {};
    let status;

    if (formData.id) {
      status = "updated";
      tap = Taps.get(formData.id);
      Taps.fillables().forEach((key) => {
        if (objectHasKey(formData, key)) {
          tap[key] = formData[key];
        }
      });
      Taps.put(tap);
    } else {
      status = "created";

      Taps.fillables().forEach((key) => {
        if (objectHasKey(formData, key)) {
          tap[key] = formData[key];
        }
      });
      tap = Taps.create(tap);
    }

    if (files.image) {
      await updateItemPrimaryImage(tap, files.image, Taps);
    }

    return respondWithJSON(res, tap, { status });
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

const tapToggleHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, (err, formData, files) => {
    if (err) {
      return next(err);
    }
    const validationRules = {
      id: ["optional:tapExists"],
      active: ["required"],
    };

    const validator = validate({ ...formData, ...files }, validationRules);

    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }

    const tap = Taps.get(formData.id);
    tap.active = isString(formData.active)
      ? formData.active.toString() !== "false"
      : !!formData.active;
    Taps.put(tap);

    return respondWithJSON(res, { status: "updated" });
  });
};

const tapsDestroyHandler = (req, res) => {
  const { id } = req.params;
  if (!Taps.has(id)) {
    return respondWithJSON(
      res,
      { status: "error", message: "Tap not found" },
      404
    );
  }

  Taps.remove(id);

  return respondWithJSON(res, { status: "Success", id });
};

module.exports = {
  tapsGetHandler,
  tapsGetFieldsHandler,
  tapsPostHandler,
  tapsMediaHandler,
  tapToggleHandler,
  tapsDestroyHandler,
};
