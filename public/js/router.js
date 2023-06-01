class Route {
  constructor(path, name, action) {
    this.middleware = [];
    this.path = path;
    this.name = name;
    this.action = action;
  }

  setMiddleware(middleware) {
    this.middleware = middleware;
    return this;
  }

  // @TODO do we make middleware async? is there a need?
  runMiddleware(params) {
    if (isArray(this.middleware)) {
      try {
        for (let i = 0; i < this.middleware.length; i++) {
          const middleware = this.middleware[i];
          if (isFunction(middleware)) {
            middleware.apply(this, [
              {
                params,
                route: this.route,
                router: this,
                app: getApp(),
              },
            ]);
          }
        }
      } catch (e) {
        // wut
      }
    }
  }

  getTitle() {
    return `Title: ${this.name}`;
  }

  async triggerAction(params, router, target) {
    if (isFunction(this.action)) {
      // @TODO async?
      this.runMiddleware(params);
      const response = await this.action.call(this.action, {
        route: this,
        router,
        params,
        app: getApp(),
        target,
      });
      if (response && response instanceof Element) {
        response.classList.add("route-view");
      }
    }
  }
}

class Router {
  constructor(middleware = []) {
    this.middleware = middleware;
    this.route = null;
    this.routes = [];
    window.addEventListener("load", this.onLoad.bind(this));
    window.addEventListener("popstate", this.onPopstate.bind(this));
    document.addEventListener("click", this.onRouteLinkClick.bind(this));
  }

  addAction(name = "", action = NOOP) {
    const route = new Route(null, name, action);
    route.setMiddleware(null);
    this.routes.push(route);
    return this;
  }

  addRoute(path, name = "", action = NOOP, middleware = []) {
    const route = new Route(path, name, action);
    route.setMiddleware([...middleware, ...this.middleware]);
    this.routes.push(route);
    return this;
  }

  getRoute(name) {
    return this.routes.find((r) => r.name === name);
  }

  getRouteByPath(path) {
    return this.routes
      .filter((r) => r.path !== null)
      .find((r) => r.path === path);
  }

  getCurrentRoute() {
    return this.getRoute(this.route);
  }

  isRoute(name) {
    const current = this.getCurrentRoute();
    return current ? current.name === name : false;
  }

  onLoad() {
    const { pathname } = window.location;
    const route = this.getRouteByPath(pathname);
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    urlParams.forEach((value, key) => {
      params[key] = value;
    });

    if (route) this.goTo(route.name, params);

    [...document.querySelectorAll("a.route-link")].forEach(($a) => {
      const route = this.getRoute($a.getAttribute("data-route"));
      if (route) $a.setAttribute("href", route.path);
    });
  }

  onPopstate(event) {
    const routeName = event.state.name;
    if (routeName) this.goTo(routeName, event.state.params);
  }

  onRouteLinkClick(e) {
    const $el = e.target;
    if ($el.matches("a.route-link, a.route-link *")) {
      e.preventDefault();
      const $a = $el.nodeName.toLowerCase() === "a" ? $el : $el.closest("a");
      let route = $a.getAttribute("data-route");
      let params = $a.getAttribute("data-route-params");
      params = params ? JSON.parse(params) : {};

      if (!route && this.getRouteByPath($a.getAttribute("href"))) {
        route = this.getRouteByPath($a.getAttribute("href")).name;
      }

      this.goTo(route, params, $a);
    }
  }

  goTo(name, params = {}, target) {
    console.group(`Router.goTo("${name}")`);
    const route = this.getRoute(name);
    if (route) {
      this.route = route;
      getApp().route = route.name;
      if (route.path) {
        const url = new URL(`${window.location.origin}${route.path}`);
        Object.entries(params).forEach(([k, v]) => {
          url.searchParams.set(k, v);
        });
        window.history.pushState(
          { name: route.name, params },
          route.getTitle(),
          url
        );
      }
      console.log({
        router: this,
        route,
        params,
        target,
      });
      // Routes clear the page through middleware,
      // since actions do not, we pass the target.
      // Actions are a cheaty way to loop into
      // existing 'click' event functionality.
      //
      route.triggerAction(params, this, target);
    } else {
      // go to 404?
    }
    console.groupEnd();
  }
}
