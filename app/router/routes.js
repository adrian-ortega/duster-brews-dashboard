const { dashboardView } = require("../http/controllers/homeController");
const { getJoke } = require("../http/controllers/jokeController");
const { mediaDestroyHandler } = require("../http/controllers/mediaController");
const {
  settingsGetHandler,
  settingsPostHandler,
} = require("../http/controllers/settingsController");
const DrinksController = require("../http/controllers/DrinksController");
const {
  locationsListHandler,
  locationsGetHandler,
  locationsPostHandler,
  locationsDestroyHandler,
  locationsFieldsHandler,
} = require("../http/controllers/locationsController");
const {
  breweriesGetHandler,
  breweriesFieldsHandler,
  breweriesPostHandler,
  breweriesDestroyHandler,
  breweriesGenerateHandler,
  breweriesListHandler,
} = require("../http/controllers/breweriesController");

module.exports = [
  // API ROUTES

  {
    path: "/api/joke",
    methods: ["GET"],
    handler: getJoke,
  },
  {
    path: "/api/media",
    methods: ["DELETE"],
    handler: mediaDestroyHandler,
  },
  {
    path: "/api/settings",
    methods: ["GET"],
    handler: settingsGetHandler,
  },
  {
    path: "/api/settings",
    methods: ["POST"],
    handler: settingsPostHandler,
  },

  // API - BREWERIES
  {
    path: "/api/breweries",
    methods: ["GET"],
    handler: breweriesListHandler,
  },
  {
    path: "/api/breweries",
    methods: ["POST", "PUT"],
    handler: breweriesPostHandler,
  },
  {
    path: "/api/breweries/auto-generate",
    methods: ["GET", "POST", "PUT", "PATCH"],
    handler: breweriesGenerateHandler,
  },
  {
    path: "/api/breweries/fields",
    methods: ["GET"],
    handler: breweriesFieldsHandler,
  },
  {
    path: "/api/breweries/:id",
    methods: ["GET"],
    handler: breweriesGetHandler,
  },
  {
    path: "/api/breweries/:id",
    methods: ["DELETE"],
    handler: breweriesDestroyHandler,
  },

  // API - DRINKS
  {
    path: "/api/drinks",
    methods: ["GET"],
    handler: DrinksController.listHandler,
  },
  {
    path: "/api/drinks",
    methods: ["POST", "PUT"],
    handler: DrinksController.postHandler,
  },
  {
    path: "/api/drinks/toggle",
    methods: ["POST", "PUT"],
    handler: DrinksController.toggleHandler,
  },
  {
    path: "/api/drinks/media",
    methods: ["POST", "PUT"],
    handler: DrinksController.mediaHandler,
  },
  {
    path: "/api/drinks/fields",
    methods: ["GET"],
    handler: DrinksController.getFieldsHandler,
  },
  {
    path: "/api/drinks/:id",
    methods: ["GET"],
    handler: DrinksController.getFieldsHandler,
  },
  {
    path: "/api/drinks/:id",
    methods: ["DELETE"],
    handler: DrinksController.destroyHandler,
  },

  // API - Locations
  {
    path: "/api/locations",
    methods: ["GET"],
    handler: locationsListHandler,
  },
  {
    path: "/api/locations",
    methods: ["POST", "PUT"],
    handler: locationsPostHandler,
  },
  {
    path: "/api/locations/fields",
    methods: ["GET"],
    handler: locationsFieldsHandler,
  },
  {
    path: "/api/locations/:id",
    methods: ["GET"],
    handler: locationsGetHandler,
  },
  {
    path: "/api/locations/:id",
    methods: ["DELETE"],
    handler: locationsDestroyHandler,
  },
  // {
  //   path: "/api(/*)?",
  //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  //   handler(req, res) {
  //     return respondWithJSON(res, {
  //       path: req.originalPath,
  //       message: "Does not exist",
  //     });
  //   },
  // },

  {
    path: "*",
    handler: dashboardView,
  },
];
