const Breweries = require("../../models/Breweries");
const { respondWithJSON } = require("../../util/http");

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

module.exports = {
  breweriesGetHandler,
  breweriesFieldsHandler,
};
