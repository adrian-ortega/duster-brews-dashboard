const { dashboardView } = require("../http/controllers/homeController");
const { widgetsApiView } = require("../http/controllers/apiController");

module.exports = [
  {
    path: "/",
    handler: dashboardView,
  },
  {
    path: "/api/widgets",
    handler: widgetsApiView,
  },
];
