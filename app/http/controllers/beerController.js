const BeerCollection = require("../../models/Items");
const BreweriesCollection = require("../../models/Breweries");
const { respondWithJSON } = require("../../util/http");

const beerGetHandler = (req, res) => respondWithJSON(res, BeerCollection.all());
const beerGetFieldsHandler = (req, res) =>
  respondWithJSON(res, [
    {
      label: "Name",
      name: "name",
      value: null,
      type: "text",
      required: true,
    },
    {
      label: "Brewery",
      name: "brewery_id",
      value: null,
      type: "select",
      required: true,
      options: BreweriesCollection.all().map((brewery) => {
        return {
          value: brewery.id,
          text: brewery.name,
        };
      }),
    },
    {
      label: "Style",
      name: "style",
      value: null,
      type: "text",
      required: true,
    },
    {
      label: "Gravity Start",
      name: "gravity_start",
      value: null,
      type: "text",
    },
    {
      label: "Gravity End",
      name: "gravity_end",
      value: null,
      type: "text",
    },
    {
      label: "ABV",
      name: "abv",
      value: null,
      type: "text",
    },
    {
      label: "IBU",
      name: "ibu",
      value: null,
      type: "text",
    },
  ]);

module.exports = {
  beerGetHandler,
  beerGetFieldsHandler,
};
