const { dashboardView } = require("../http/controllers/homeController");
const {
  widgetsApiHandler,
  widgetsImageHandler,
  settingsGetHandler,
  settingsPostHandler,
} = require("../http/controllers/apiController");

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
    handler: widgetsApiHandler,
  },
  {
    path: "/api/widgets/image",
    methods: ["POST"],
    handler: widgetsImageHandler,
  },
];
