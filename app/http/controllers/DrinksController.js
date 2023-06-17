const formidable = require("formidable");
const Drinks = require("../../models/Drinks");
const Breweries = require("../../models/Breweries");
const Locations = require("../../models/Taps");
const transformer = require("../transformers/drink-transformer");
const { validate } = require("../../validation");
const { isString, objectHasKey } = require("../../util/helpers");
const { respondWithJSON } = require("../../util/http");
const { updateItemPrimaryImage } = require("../../util/models");

const listHandler = async (req, res) => {
  try {
    const items = await Promise.all(Drinks.all().map(transformer));
    return respondWithJSON(res, items);
  } catch (e) {
    console.log(e);
    return respondWithJSON(res, e, 500);
  }
};

const getHandler = async (req, res) => {
  const { id } = req.params;
  if (!Drinks.has(id)) {
    return respondWithJSON(
      res,
      { status: "error", message: "Drink not found" },
      404
    );
  }
  return respondWithJSON(res, await transformer(Drinks.get(id)));
};

const getFieldsHandler = (req, res) => {
  let { fields } = require("../../settings/drink.fields.json");
  const toOption = (m) => ({ value: m.id, text: m.name });
  const locationOptions = Locations.all().map(toOption);
  const breweryOptions = Breweries.all().map(toOption);
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

const postHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData, files) => {
    if (err) {
      return next(err);
    }
    const validationRules = {
      id: ["optional:drinkExists"],
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
    let drink = {};
    let status;

    if (formData.id) {
      status = "updated";
      drink = Drinks.get(formData.id);
      Drinks.fillables().forEach((key) => {
        if (objectHasKey(formData, key)) {
          drink[key] = formData[key];
        }
      });
      Drinks.put(drink);
    } else {
      status = "created";

      Drinks.fillables().forEach((key) => {
        if (objectHasKey(formData, key)) {
          drink[key] = formData[key];
        }
      });
      drink = Drinks.create(drink);
    }

    if (files.image) {
      await updateItemPrimaryImage(drink, files.image, Drinks);
    }

    return respondWithJSON(res, drink, { status });
  });
};

const mediaHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, async (err, formData, files) => {
    if (err) {
      next(err);
    }
    const validator = validate(
      { ...formData, ...files },
      {
        media: ["required", "isValidImage"],
        drink_id: ["required", "drinkExists"],
      }
    );
    if (validator.failed()) {
      return respondWithJSON(
        res,
        { status: 422, errors: validator.getErrors() },
        422
      );
    }

    await updateItemPrimaryImage(
      Drinks.get(formData.drink_id),
      files.media,
      Drinks
    );

    return respondWithJSON(res, {
      status: "success",
      image: Drinks.get(formData.drink_id).media[0],
    });
  });
};

const toggleHandler = (req, res, next) => {
  const form = formidable();
  form.parse(req, (err, formData, files) => {
    if (err) {
      return next(err);
    }
    const validationRules = {
      id: ["optional:drinkExists"],
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

    const drink = Drinks.get(formData.id);
    drink.active = isString(formData.active)
      ? formData.active.toString() !== "false"
      : !!formData.active;
    Drinks.put(drink);

    return respondWithJSON(res, { status: "updated" });
  });
};

const destroyHandler = (req, res) => {
  const { id } = req.params;
  if (!Drinks.has(id)) {
    return respondWithJSON(
      res,
      { status: "error", message: "Drink not found" },
      404
    );
  }

  Drinks.remove(id);

  return respondWithJSON(res, { status: "Success", id });
};

module.exports = {
  listHandler,
  getHandler,
  getFieldsHandler,
  postHandler,
  mediaHandler,
  toggleHandler,
  destroyHandler,
};
