((app) => {
  const main = new MainController();
  const drinks = new DrinksController();
  const taps = new TapsController();
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
  app.router.addRoute("/taps", "taps", taps.renderGrid.bind(taps));
  app.router.addRoute("/taps/add", "add-tap", taps.renderCreateForm.bind(taps));
  app.router.addRoute("/taps/edit", "edit-tap", taps.renderEditForm.bind(taps));
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
