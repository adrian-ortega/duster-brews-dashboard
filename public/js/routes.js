((app) => {
  const main = new MainController();
  const drinks = new DrinksController();
  const locations = new TapLocationsController();
  const settings = new SettingsController();
  const brews = new BreweriesController();

  app.router.addRoute("/", "home", main.renderHome.bind(main));

  app.router.addRoute(
    "/settings",
    "settings",
    settings.renderSettings.bind(settings)
  );
  app.router.addRoute("/drinks", "drinks", drinks.renderGrid.bind(drinks));
  app.router.addRoute(
    "/drinks/add",
    "add-drink",
    drinks.renderCreateForm.bind(drinks)
  );
  app.router.addRoute(
    "/drinks/edit",
    "edit-drink",
    drinks.renderEditForm.bind(drinks)
  );
  app.router.addRoute(
    "/taps/locations",
    "locations",
    locations.renderGrid.bind(locations)
  );
  app.router.addRoute(
    "/taps/locations/add",
    "add-location",
    locations.renderCreateForm.bind(locations)
  );
  app.router.addRoute(
    "/taps/locations/edit",
    "edit-location",
    locations.renderEditForm.bind(locations)
  );
  app.router.addRoute("/breweries", "breweries", brews.renderGrid.bind(brews));
  app.router.addRoute(
    "/breweries/add",
    "add-brewery",
    brews.renderCreateForm.bind(brews)
  );
  app.router.addRoute(
    "/breweries/edit",
    "edit-brewery",
    brews.renderEditForm.bind(brews)
  );
  app.router.addAction("generate-breweries", brews.autoGenerate.bind(brews));
})(window[window.APP_NS]);
