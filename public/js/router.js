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

  async runMiddleware(routeParams) {
    if (isArray(this.middleware)) {
      try {
        for (let i = 0; i < this.middleware.length; i++) {
          const middleware = this.middleware[i];
          if (isFunction(middleware)) {
            await middleware.call(this, routeParams);
          }
        }
      } catch (e) {
        console.log(e);
        // @TODO we'll likely have to remove this since errors from
        //       middleware should bubble up
      }
    }
  }

  getTitle() {
    return `Title: ${this.name}`;
  }

  async triggerAction(params, router, target) {
    if (isFunction(this.action)) {
      const routeParams = {
        route: this,
        router,
        params,
        app: getApp(),
        target,
      };
      await this.runMiddleware(routeParams);
      const response = await this.action.call(this.action, routeParams);
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
    this.viewReady = false;
    window.addEventListener("load", this.onLoad.bind(this));
    window.addEventListener("popstate", this.onPopstate.bind(this));
    document.addEventListener("click", this.onRouteLinkClick.bind(this));
  }

  addMiddleware(middlware) {
    if (isFunction(middlware)) {
      this.middleware.push(middlware);
    }
    return this;
  }

  addAction(name = "", action = NOOP) {
    const route = new Route(null, name, action);
    route.action = true;
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

      let tId;
      const triggerAction = () => {
        if (route.action || this.viewReady) {
          clearTimeout(tId);
          return route.triggerAction(params, this, target);
        }

        tId = setTimeout(triggerAction, 1);
      };
      triggerAction();
    } else {
      // go to 404?
    }
    console.groupEnd();
  }
}

window[window.APP_NS].router = new Router();
