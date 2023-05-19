class Route {
  constructor(path, name, action) {
    this.path = path;
    this.name = name;
    this.action = action;
  }

  getTitle() {
    return `Title: ${this.name}`;
  }

  triggerAction(router) {
    if (isFunction(this.action)) {
      this.action({ route: this, router, app: getApp() });
    }
  }
}

class Router {
  constructor(middleware = []) {
    this.middleware = middleware;
    this.route = null;
    this.routes = [];
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

  getCurrentRoute() {
    return this.getRoute(this.route);
  }

  isRoute(name) {
    const current = this.getCurrentRoute();
    return current ? current.name === name : false;
  }

  onPopstate(event) {
    const routeName = event.state.name;
    console.log({ routeName });
    if (routeName) this.goTo(routeName);
  }

  onRouteLinkClick(event) {
    if (
      event.target.matches("a[href]") ||
      event.target.closest("a").classList.contains("route-link")
    ) {
      event.preventDefault();
      const a =
        event.target.nodeName.toLowerCase() === "a"
          ? event.target
          : event.target.closest("a");
      this.goTo(a.getAttribute("data-route"));
    }
  }

  goTo(name) {
    const route = this.getRoute(name);
    if (route) {
      this.route = route;
      getApp().route = route.name;
      this.runMiddleware();
      window.history.pushState(
        { name: route.name },
        route.getTitle(),
        route.path
      );
      route.triggerAction(this);
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
        <div class="nav-item nav-buttons">
          <a href="/" data-route="taps" class="button nav-button route-link">
            <span class="icon"></span>
            <span class="text">Menu</span>
          </a>
          <a href="/settings" data-route="settings" class="button nav-button route-link">
            <span class="icon"></span>
            <span class="text">Settings</span>
          </a>
        </div>
      </div>
    </div>`;
  }
}

function initializeNav() {
  const nav = new Navigation();
  nav.render(getDomContainer());
}
