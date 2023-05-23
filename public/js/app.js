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

const initializeRouter = () => {
  const router = new Router([clearContainersMiddlware]);
  const taps = new TapsController();
  const settings = new SettingsController();

  router.addRoute("/", "home", taps.renderList.bind(taps));
  router.addRoute(
    "/settings",
    "settings",
    settings.renderSettings.bind(settings)
  );
  router.addRoute("/taps", "taps", taps.renderGrid.bind(taps));
  router.addRoute("/create-tap", "edit-tap", taps.renderCreateForm.bind(taps));
  router.addRoute("/edit-tap", "edit-tap", taps.renderEditForm.bind(taps));
  router.addRoute("/breweries", "breweries", NOOP);

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
(async () => {
  await initialize();
})();
