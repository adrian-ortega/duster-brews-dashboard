const formidable = require("formidable");
const Breweries = require("../../models/Breweries");
const axios = require("axios");
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
      Breweries.put(brewery);
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
  breweriesGetHandler,
  breweriesFieldsHandler,
  breweriesPostHandler,
  breweriesDestroyHandler,
  breweriesGenerateHandler,
};
