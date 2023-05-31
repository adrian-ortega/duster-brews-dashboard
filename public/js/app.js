const burnInGuard = () => {
  const $el = document.createElement("div");
  $el.innerHTML = '<div class="burn-in-guard__logo"></div>';
  $el.classList.add("burn-in-guard");
  document.body.appendChild($el);

  setTimeout(() => $el.classList.add("animate"), 100);
  setTimeout(() => $el.parentNode.removeChild($el), 3000);
};

const clearContainersMiddlware = ({ route, router, app }) => {
  const $oldContainers = [...getDomContainer().querySelectorAll(".route-view")];
  if ($oldContainers.length > 0) {
    for (let i = 0; i < $oldContainers.length; i++) {
      const $oc = $oldContainers[i];
      $oc.parentNode.removeChild($oc);
    }
  }
};

const themeAndViewMiddleware = ({ route }) => {
  const { settings } = getApp().state;
  const $el = document;
  $el.className = "";
  $el.classList.add(`theme-${settings.theme}`);
  $el.classList.add(`route-${route.getName()}`);
};

const initializeRouter = () => {
  const router = new Router([clearContainersMiddlware, themeAndViewMiddleware]);

  const taps = new TapsController();
  const locations = new TapLocationsController();
  const settings = new SettingsController();
  const brews = new BreweriesController();

  router.addRoute("/", "home", taps.renderList.bind(taps));
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

  getApp().router = router;
};

/**
 * Main
 * @return {Promise<void>}
 */
const initialize = async () => {
  const app = getApp();
  app.selector = "#app";
  app.ws = false;

  const $container = getDomContainer();
  if ($container) $container.innerHTML = "";

  initializeRouter();
  Navigation.init();

  await createWebSocket({
    onmessage: (data) => {
      if (objectHasKey(data, "burnInGuard")) {
        return burnInGuard();
      }

      if (objectHasKey(data, "settings")) {
        // @TODO create a state handler?
        app.state.settings = { ...data.settings };
        app.state.fields = { ...data.fields };
        app.state.categories = { ...data.categories };
      }

      if (objectHasKey(data, "tap_locations")) {
        app.state.tap_locations = [...data.tap_locations];
      }

      if (objectHasKey(data, "breweries")) {
        app.state.breweries = [...data.breweries];
      }

      if (objectHasKey(data, "taps")) {
        app.state.taps = [...data.taps];
      }
    },
  });
};

// Go baby go
(async () => await initialize())();
