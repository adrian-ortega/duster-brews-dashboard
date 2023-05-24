const { dashboardView } = require("../http/controllers/homeController");
const {
  tapsGetHandler,
  tapsGetFieldsHandler,
  tapsPostHandler,
  tapsMediaHandler,
  tapToggleHandler,
  tapsDestroyHandler,
} = require("../http/controllers/tapsController");
const {
  settingsGetHandler,
  settingsPostHandler,
} = require("../http/controllers/settingsController");
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

  {
    path: "/*",
    handler: dashboardView,
  },
];
