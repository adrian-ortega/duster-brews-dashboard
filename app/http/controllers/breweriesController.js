const formidable = require("formidable");
const Breweries = require("../../models/Breweries");
const axios = require("axios");
const breweryTransformer = require("../transformers/brewery-transformer");
const { validate } = require("../../validation");
const { respondWithJSON } = require("../../util/http");
const { updateItemPrimaryImage } = require("../../util/models");
const { objectHasKey } = require("../../util/helpers");

const breweriesListHandler = async (req, res) => {
  try {
    const breweries = await Promise.all(
      Breweries.all().map(breweryTransformer)
    );
    return respondWithJSON(res, breweries);
  } catch (e) {
    return respondWithJSON(res, e, 500);
  }
};

const breweriesGetHandler = async (req, res) => {
  const { id } = req.params;
  if (!Breweries.has(id)) {
    return respondWithJSON(
      res,
      { status: "error", message: "Brewery not found" },
      404
    );
  }
  return respondWithJSON(res, await breweryTransformer(Breweries.get(id)));
};

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
    let brewery = {};
    let status;
    if (formData.id) {
      status = "updated";
      brewery = Breweries.get(formData.id);
      Breweries.fillables().forEach((key) => {
        if (objectHasKey(formData, key)) {
          brewery[key] = formData[key];
        }
      });
      Breweries.put(brewery);
    } else {
      status = "created";
      Breweries.fillables().forEach((key) => {
        if (objectHasKey(formData, key)) {
          brewery[key] = formData[key];
        }
      });
      brewery = Breweries.create(brewery);
    }

    if (files.image) {
      await updateItemPrimaryImage(brewery, files.image, Breweries);
    }

    return respondWithJSON(res, { status });
  });
};

const breweriesDestroyHandler = (req, res) => {
  const { id } = req.params;
  if (!Breweries.has(id)) {
    return respondWithJSON(
      res,
      { status: "error", message: "Brewery not found" },
      404
    );
  }

  Breweries.remove(id);

  return respondWithJSON(res, { status: "Success", id });
};

const breweriesGenerateHandler = async (req, res) => {
  const getPage = (page = 1, per_page = 10) => {
    return axios
      .get("https://api.openbrewerydb.org/v1/breweries", {
        params: { page, per_page },
      })
      .then(({ data }) => {
        return data.map((b) => ({
          id: b.id,
          name: b.name,
        }));
      });
  };

  const { data } = await axios.get(
    "https://api.openbrewerydb.org/v1/breweries/meta"
  );
  const total = parseInt(data.total, 10);
  let page = parseInt(data.page, 10);
  let breweries = [];
  while (breweries.length < total) {
    breweries = [...breweries, ...(await getPage(page, data.per_page))];
    Breweries.put(breweries);
    page++;
  }
  return respondWithJSON(res, breweries);
};

module.exports = {
  breweriesListHandler,
  breweriesGetHandler,
  breweriesFieldsHandler,
  breweriesPostHandler,
  breweriesDestroyHandler,
  breweriesGenerateHandler,
};
