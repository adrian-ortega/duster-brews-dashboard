((app) => {
  // clear containers
  app.router.addMiddleware(() => {
    const $container = getDomContainer();
    // if (!$container.classList.contains("init")) {
    //   $container.classList.add("init");
    //   $container.innerHTML = "";
    // }
    const $oldContainers = [...$container.querySelectorAll(".route-view")];
    if ($oldContainers.length > 0) {
      for (let i = 0; i < $oldContainers.length; i++) {
        const $oc = $oldContainers[i];
        $oc.parentNode.removeChild($oc);
      }
    }
  });

  // Theme and Views
  app.router.addMiddleware(({ route }) => {
    const { settings } = app.store.getState();
    document.body.classList.add(`route-${route.name}`);
    if (settings && settings.theme) {
      document.body.classList.add(`theme-${settings.theme}`);
    }
  });
})(window[window.APP_NS]);
