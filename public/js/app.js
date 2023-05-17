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

      if (objectHasKey(data, "breweries")) {
        window[window.APP_NS].state.breweries = [...data.breweries];
      }

      if (objectHasKey(data, "taps")) {
        window[window.APP_NS].state.taps = [...data.taps];
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

  ["ShowSettings"].forEach((eventName) => {
    document.addEventListener(eventName, showNavButtons);
  });

  ["ShowTaps", "EditTaps", "AddTap", "EditBreweries", "AddBrewery"].forEach(
    (eventName) => {
      document.addEventListener(eventName, hideNavButtons);
    }
  );

  [
    "ShowSettings",
    "ShowTaps",
    "EditTaps",
    "AddTap",
    "EditBreweries",
    "AddBrewery",
  ].forEach((eventName) => {
    document.addEventListener(eventName, () => {
      const $container = getDomContainer();
      const $oldContainers = [
        ...$container.querySelectorAll(".edit-container"),
      ];
      if ($oldContainers.length > 0) {
        $oldContainers.forEach(($oc) => $container.removeChild($oc));
      }
      console.log("Resetting for", eventName);
    });
  });

  document.addEventListener("ShowSettings", () => {
    renderSettings();
    window[APP_NS].route = "settings";
    window[window.APP_NS].fireAction("refreshSettings");
  });
  document.addEventListener("ShowTaps", () => {
    renderPlaceholders();
    window[window.APP_NS].route = "home";
    window[window.APP_NS].fireAction("refreshWidgets");
  });
  document.addEventListener("EditTaps", () => {
    window[window.APP_NS].route = "edit-tap";
    renderEditTapsForm();
  });
  document.addEventListener("AddTap", () => {
    window[window.APP_NS].route = "add-tap";
    renderCreateTapForm();
  });
  document.addEventListener("EditBreweries", () => {
    window[window.APP_NS].route = "edit-breweries";
    renderEditBreweriesForm();
  });
  document.addEventListener("AddBrewery", () => {
    window[window.APP_NS].route = "add-brewery";
    renderCreateBreweryForm();
  });
})();
