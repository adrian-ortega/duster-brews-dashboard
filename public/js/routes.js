(({ router }) => {
  const main = new MainController();
  const taps = new TapsController();
  const locations = new TapLocationsController();
  const settings = new SettingsController();
  const brews = new BreweriesController();

  router.addRoute("/", "home", main.renderHome.bind(main));

  router.addRoute(
    "/settings",
    "settings",
    settings.renderSettings.bind(settings)
  );
  router.addRoute("/taps", "taps", taps.renderGrid.bind(taps));
  router.addRoute("/taps/add", "add-tap", taps.renderCreateForm.bind(taps));
  router.addRoute("/taps/edit", "edit-tap", taps.renderEditForm.bind(taps));
  router.addRoute(
    "/taps/locations",
    "locations",
    locations.renderGrid.bind(locations)
  );
  router.addRoute(
    "/taps/locations/add",
    "add-location",
    locations.renderCreateForm.bind(locations)
  );
  router.addRoute(
    "/taps/locations/edit",
    "edit-location",
    locations.renderEditForm.bind(locations)
  );
  router.addRoute("/breweries", "breweries", brews.renderGrid.bind(brews));
  router.addRoute(
    "/breweries/add",
    "add-brewery",
    brews.renderCreateForm.bind(brews)
  );
  router.addRoute(
    "/breweries/edit",
    "edit-brewery",
    brews.renderEditForm.bind(brews)
  );
  router.addAction("generate-breweries", brews.autoGenerate.bind(brews));
})(window[window.APP_NS]);
