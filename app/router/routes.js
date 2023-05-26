const { dashboardView } = require("../http/controllers/homeController");
const {
  settingsGetHandler,
  settingsPostHandler,
} = require("../http/controllers/settingsController");
const {
  tapsGetHandler,
  tapsGetFieldsHandler,
  tapsPostHandler,
  tapsMediaHandler,
  tapToggleHandler,
  tapsDestroyHandler,
} = require("../http/controllers/tapsController");
const {
  locationsGetHandler, locationsPostHandler, locationsDestroyHandler, locationsFieldsHandler
} = require("../http/controllers/locationsController");
const {
  breweriesGetHandler,
  breweriesFieldsHandler,
  breweriesPostHandler,
  breweriesDestroyHandler,
} = require("../http/controllers/breweriesController");

module.exports = [
  // API ROUTES

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
    handler: breweriesGetHandler,
  },
  {
    path: "/api/breweries",
    methods: ["POST", "PUT"],
    handler: breweriesPostHandler,
  },
  {
    path: "/api/breweries/:id",
    methods: ["DELETE"],
    handler: breweriesDestroyHandler,
  },
  {
    path: "/api/breweries/fields",
    methods: ["GET"],
    handler: breweriesFieldsHandler,
  },

  // API - TAPS
  {
    path: "/api/taps",
    methods: ["GET"],
    handler: tapsGetHandler,
  },
  {
    path: "/api/taps",
    methods: ["POST", "PUT"],
    handler: tapsPostHandler,
  },
  {
    path: "/api/taps/:id",
    methods: ["DELETE"],
    handler: tapsDestroyHandler,
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

  // API - Locations
  {
    path: "/api/locations",
    methods: ["GET"],
    handler: locationsGetHandler,
  },
  {
    path: "/api/locations",
    methods: ["POST", "PUT"],
    handler: locationsPostHandler,
  },
  {
    path: "/api/locations/:id",
    methods: ["DELETE"],
    handler: locationsDestroyHandler,
  },
  {
    path: "/api/locations/fields",
    methods: ["GET"],
    handler: locationsFieldsHandler,
  },

  {
    path: "/*",
    handler: dashboardView,
  },
];
