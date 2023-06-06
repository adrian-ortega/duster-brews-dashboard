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
    const $root = document.getElementsByTagName("html");
    [...$root[0].classList].forEach((cssClass) => {
      if (cssClass.match(/route?-(.+)$/gm)) {
        $root[0].classList.remove(cssClass);
      }
    });

    $root[0].classList.add(`route-${route.name}`);
    if (settings && settings.theme) {
      $root[0].classList.add(`theme-${settings.theme}`);
    }
  });
})(window[window.APP_NS]);
