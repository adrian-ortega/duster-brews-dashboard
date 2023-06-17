const formidable = require("formidable");
const Settings = require("../../settings");
const Taps = require("../../models/Taps");
const transformer = require("../transformers/tap-transformer");
const { validate } = require("../../validation");
const { objectHasKey } = require("../../util/helpers");
const { respondWithJSON } = require("../../util/http");

const listHandler = async (req, res) => {
  try {
    const items = await Promise.all(Taps.all().map(transformer));
    return respondWithJSON(res, items);
  } catch (e) {
    return respondWithJSON(res, e, 500);
  }
};

const getHandler = async (req, res) => {
  const { id } = req.params;
  if (!Taps.has(id)) {
    return respondWithJSON(
      res,
      { status: "error", message: "Tap not found" },
      404
    );
  }
  return respondWithJSON(res, await transformer(Taps.get(id)));
};

const getFieldsHandler = (req, res) => {
  let { fields } = require("../../settings/tap.fields.json");
  if (!Settings.get("enable_plaato", false)) {
    fields = fields.filter((f) => f.name !== "token");
  }
  return respondWithJSON(res, fields);
};

const postHandler = (req, res, next) => {
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

    return respondWithJSON(res, { status });
  });
};

const destroyHandler = (req, res) => {
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
  listHandler,
  getHandler,
  getFieldsHandler,
  postHandler,
  destroyHandler,
};
