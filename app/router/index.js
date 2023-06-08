const routes = require("./routes");
const registeredMiddleware = require("../http/middleware");
const { isFunction } = require("../util/helpers");

const DEFAULT_ROUTE_METHODS = [
  "GET",
  "OPTIONS",
  "PUT",
  "POST",
  "PATCH",
  "DELETE",
];
const DEFAULT_ROUTE = {
  path: "*",
  methods: [DEFAULT_ROUTE_METHODS[0]],
  middleware: [],
  handler: () => {
    // return 404 or other errors
  },
};

const tl = (a) => a.toLowerCase();
const drm = [...DEFAULT_ROUTE_METHODS].map(tl);

const router = (app) => {
  const sanitizedRoutes = [...routes].map((route) => ({
    ...DEFAULT_ROUTE,
    ...route,
  }));
  sanitizedRoutes.forEach((route) => {
    const { methods, path, middleware, handler } = route;
    const requestMethods = methods.map(tl).filter((m) => drm.includes(m));
    requestMethods.forEach((method) => {
      if (isFunction(handler)) {
        const routeMiddleware = [...registeredMiddleware, ...middleware];
        app[method](path, routeMiddleware, handler);
      }
    });
  });
};

module.exports = router;
