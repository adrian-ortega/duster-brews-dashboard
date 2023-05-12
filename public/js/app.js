/**
 * Callback for the websocket onMessage event
 * @param {Array|Array<{}>} items
 * @param {Number} timestamp
 * @return {Promise<void>}
 */
const updateWidgets = async ({ items, timestamp }) =>
  await renderWidgets(items, timestamp || performance.now());

const burnInGuard = () => {
  const $el = document.createElement("div");
  $el.innerHTML = '<div class="burn-in-guard__logo"></div>';
  $el.classList.add("burn-in-guard");
  document.body.appendChild($el);

  setTimeout(() => $el.classList.add("animate"), 100);
  setTimeout(() => $el.parentNode.removeChild($el), 3000);
};

/**
 * Main
 * @return {Promise<void>}
 */
const initialize = async () => {
  window[window.APP_NS].selector = "#app";
  window[window.APP_NS].ws = false;

  const isRoute = (route) => window[APP_NS].route === route;
  const $container = getDomContainer();
  if ($container) $container.innerHTML = "";

  initializeNav();
  renderPlaceholders();
  await createWebSocket({
    onmessage: (data) => {
      if (objectHasKey(data, "burnInGuard")) {
        return burnInGuard();
      }

      if (objectHasKey(data, "settings")) {
        window[APP_NS].state.settings = { ...data.settings };
        window[APP_NS].state.fields = { ...data.fields };
        window[APP_NS].state.categories = { ...data.categories };
        if (isRoute("settings")) renderSettings();
      }

      if (objectHasKey(data, "items")) {
        window[window.APP_NS].state.items = [...data.items];
        if (isRoute("home")) updateWidgets(data);
      }
    },
  });
};

const showNavButtons = () => {
  document.querySelector(".nav-buttons").classList.add("is-hidden");
};

const hideNavButtons = () => {
  document.querySelector(".nav-buttons").classList.remove("is-hidden");
};

// Go baby go
(async () => {
  await initialize();
  document.addEventListener("ShowSettings", () => {
    renderSettings();
    window[APP_NS].route = "settings";
    window[window.APP_NS].fireAction("refreshSettings");
  });

  document.addEventListener("ShowBeers", () => {
    renderPlaceholders();
    window[window.APP_NS].route = "home";
    window[window.APP_NS].fireAction("refreshWidgets");
  });

  document.addEventListener("EditBeers", () => {
    window[window.APP_NS].route = "edit-beer";
    renderEditBeersForm();
  });
  document.addEventListener("AddBeer", () => {
    window[window.APP_NS].route = "add-beer";
    renderCreateBeerForm();
  });
  document.addEventListener("EditBreweries", () => {
    window[window.APP_NS].route = "edit-breweries";
  });
  document.addEventListener("AddBrewery", () => {
    window[window.APP_NS].route = "add-brewery";
  });

  ["ShowSettings"].forEach((eventName) => {
    document.addEventListener(eventName, showNavButtons);
  });

  ["ShowBeers", "EditBeers", "AddBeer", "EditBreweries", "AddBrewery"].forEach(
    (eventName) => {
      document.addEventListener(eventName, hideNavButtons);
    }
  );

  [
    "ShowSettings",
    "ShowBeers",
    "EditBeers",
    "AddBeer",
    "EditBreweries",
    "AddBrewery",
  ].forEach((eventName) => {
    document.addEventListener(eventName, () => {
      const $container = getDomContainer();
      const $widgets = $container.querySelector(".widgets");
      if ($widgets) {
        $container.removeChild($widgets);
      }
    });
  });
})();
