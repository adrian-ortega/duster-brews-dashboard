const { dashboardView } = require("../http/controllers/homeController");
const {
  beerGetHandler,
  beerGetFieldsHandler,
} = require("../http/controllers/beerController");
const {
  settingsGetHandler,
  settingsPostHandler,
} = require("../http/controllers/settingsController");
const {
  listWidgetsHandler,
  imageUploadHandler,
} = require("../http/controllers/widgetsController");

module.exports = [
  {
    path: "/",
    handler: dashboardView,
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
  {
    path: "/api/widgets",
    methods: ["GET"],
    handler: listWidgetsHandler,
  },
  {
    path: "/api/widgets/image",
    methods: ["POST"],
    handler: imageUploadHandler,
  },
  {
    path: "/api/beer",
    methods: ["GET"],
    handler: beerGetHandler,
  },
  {
    path: "/api/beer/fields",
    methods: ["GET"],
    handler: beerGetFieldsHandler,
  },
];
