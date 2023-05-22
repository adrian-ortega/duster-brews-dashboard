class Route {
  constructor(path, name, action) {
    this.path = path;
    this.name = name;
    this.action = action;
  }

  getTitle() {
    return `Title: ${this.name}`;
  }

  triggerAction(params, router) {
    if (isFunction(this.action)) {
      const response = this.action({
        route: this,
        router,
        params,
        app: getApp(),
      });
      if (response instanceof Element) {
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

  addRoute(path, name = "", action = NOOP) {
    this.routes.push(new Route(path, name, action));
    return this;
  }

  getRoute(name) {
    return this.routes.find((r) => r.name === name);
  }

  getRouteByPath(path) {
    return this.routes.find((r) => r.path === path);
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
    if (route) this.goTo(route.name);
  }

  onPopstate(event) {
    const routeName = event.state.name;
    console.log({ routeName });
    if (routeName) this.goTo(routeName);
  }

  onRouteLinkClick(event) {
    if (
      event.target.matches("a[href]") ||
      (event.target.closest("a") &&
        event.target.closest("a").classList.contains("route-link"))
    ) {
      event.preventDefault();
      const a =
        event.target.nodeName.toLowerCase() === "a"
          ? event.target
          : event.target.closest("a");
      this.goTo(a.getAttribute("data-route"));
    }
  }

  goTo(name, params = {}) {
    const route = this.getRoute(name);
    if (route) {
      this.route = route;
      getApp().route = route.name;
      this.runMiddleware();
      const urlParams = Object.entries(params).map(([k, v]) => `${k}=${v}`);

      window.history.pushState(
        { name: route.name, params },
        route.getTitle(),
        route.path + (urlParams.length > 0 ? `?${urlParams.join("&")}` : "")
      );
      route.triggerAction(params, this);
    } else {
      // go to 404?
    }
  }

  runMiddleware() {
    if (isArray(this.middleware)) {
      try {
        for (let i = 0; i < this.middleware.length; i++) {
          const middleware = this.middleware[i];
          if (isFunction(middleware)) {
            middleware.apply(this, [
              {
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
}

class Navigation extends Templateable {
  template() {
    // @TODO change these two variables to pull from saved data within
    //       the settings json file
    //
    const src = "/images/duster-brews-logo.svg";
    const alt = "Duster Brews";
    return `<div class="nav">
      <div class="nav-left">
        <div class="nav-item logo">
          <figure><span><img src="${src}" alt="${alt}"/></span></figure>
        </div>
      </div>
      <div class="nav-right">
        <div class="nav-item">
          <a href="/" data-route="home" class="button nav-button route-link" title="Taps">
            <span class="icon">${ICON_BEER_OUTLINE}</span>
          </a>
        </div>
        <div class="nav-item has-sub">
          <a href="/settings" data-route="settings" class="button nav-button route-link" title="Settings">
            <span class="icon">${ICON_COG_OUTLINE}</span>
          </a>
          <div class="nav-sub">
            <h3>Manage</h3>
            <a href="/taps" data-route="taps" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_COG_OUTLINE}</span>
              <span class="text">Taps</span>
            </a>
            <a href="/breweries" data-route="breweries" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_COG_OUTLINE}</span>
              <span class="text">Breweries</span>
            </a>
            <hr/>
            <a href="/settings" data-route="settings" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_COG_OUTLINE}</span>
              <span class="text">Settings</span>
            </a>
          </div>
        </div>
      </div>
    </div>`;
  }
}

function initializeNav() {
  const nav = new Navigation();
  nav.render(null, getDomContainer());
}
