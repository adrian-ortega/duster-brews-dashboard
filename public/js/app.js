/**
 * Callback for the websocket onMessage event
 * @param {Array|Array<{}>} items
 * @param {Number} timestamp
 * @return {Promise<void>}
 */
const updateWidgets = async ({ taps, breweries, timestamp }) => {
  timestamp = timestamp || performance.now();

  if (breweries.length === 0) {
    return renderFirstTimeBreweries();
  } else if (taps.length === 0) {
    return renderFirstTimeTaps();
  }
  return renderWidgets(taps, timestamp);
};

const burnInGuard = () => {
  const $el = document.createElement("div");
  $el.innerHTML = '<div class="burn-in-guard__logo"></div>';
  $el.classList.add("burn-in-guard");
  document.body.appendChild($el);

  setTimeout(() => $el.classList.add("animate"), 100);
  setTimeout(() => $el.parentNode.removeChild($el), 3000);
};

const clearContainersMiddlware = ({ route, router, app }) => {
  const $container = getDomContainer();
  const $oldContainers = [
    ...$container.querySelectorAll(".edit-container, .taps"),
  ];
  if ($oldContainers.length > 0) {
    $oldContainers.forEach(($oc) => $container.removeChild($oc));
  }
};

const initializeRouter = () => {
  const router = new Router([clearContainersMiddlware]);
  const tapsController = new TapsController;
  const settingsController = new SettingsController;

  router.addRoute("/", "taps", tapsController.renderList.bind(tapsController));
  router.addRoute("/settings", "settings", settingsController.renderSettings.bind(settingsController));

  router.addRoute("/settings/add-tap", "add-tap", renderCreateTapForm);
  router.addRoute(
    "/settings/add-brewery",
    "add-brewery",
    renderCreateBreweryForm
  );

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
  initializeNav();

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

        if (app.route === "settings") renderSettings();
      }

      if (objectHasKey(data, "breweries")) {
        app.state.breweries = [...data.breweries];
      }

      if (objectHasKey(data, "taps")) {
        app.state.taps = [...data.taps];
        if (app.route === "home") app.router.goTo('taps');
      }
    },
  });
};

// Go baby go
(async () => {
  await initialize();
})();
