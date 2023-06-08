const { dashboardView } = require("../http/controllers/homeController");
const { getJoke } = require("../http/controllers/jokeController");
const { mediaDestroyHandler } = require("../http/controllers/mediaController");
const {
  settingsGetHandler,
  settingsPostHandler,
} = require("../http/controllers/settingsController");
const {
  tapsListHandler,
  tapsGetHandler,
  tapsGetFieldsHandler,
  tapsPostHandler,
  tapsMediaHandler,
  tapToggleHandler,
  tapsDestroyHandler,
} = require("../http/controllers/tapsController");
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

  // API - TAPS
  {
    path: "/api/taps",
    methods: ["GET"],
    handler: tapsListHandler,
  },
  {
    path: "/api/taps",
    methods: ["POST", "PUT"],
    handler: tapsPostHandler,
  },
  {
    path: "/api/taps/toggle",
    methods: ["POST", "PUT"],
    handler: tapToggleHandler,
  },
  {
    path: "/api/taps/media",
    methods: ["POST", "PUT"],
    handler: tapsMediaHandler,
  },
  {
    path: "/api/taps/fields",
    methods: ["GET"],
    handler: tapsGetFieldsHandler,
  },
  {
    path: "/api/taps/:id",
    methods: ["GET"],
    handler: tapsGetHandler,
  },
  {
    path: "/api/taps/:id",
    methods: ["DELETE"],
    handler: tapsDestroyHandler,
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
