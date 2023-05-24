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
    return this.routes.find((r) => {
      console.log({ r_path: r.path, path });
      return r.path === path;
    });
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

      this.goTo(route, params);
    }
  }

  goTo(name, params = {}) {
    const route = this.getRoute(name);
    if (route) {
      this.route = route;
      getApp().route = route.name;
      this.runMiddleware(params);
      const url = new URL(`${window.location.origin}${route.path}`);
      Object.entries(params).forEach(([k, v]) => {
        url.searchParams.set(k, v);
      });
      window.history.pushState(
        { name: route.name, params },
        route.getTitle(),
        url
      );
      route.triggerAction(params, this);
    } else {
      // go to 404?
    }
  }

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
}

class RouteController extends Templateable {
  getTap(id) {
    return window[window.APP_NS].state.taps.find((t) => t.id === id);
  }

  getBrewery(id) {
    return window[window.APP_NS].state.breweries.find((b) => b.id === id);
  }

  getQueryParm(key, defaultValue = "") {
    if (!this.queryParams) {
      this.queryParams = new URLSearchParams(window.location.search);
    }

    return this.queryParams.has(key) ? this.queryParams.get(key) : defaultValue;
  }

  getCurrentUrl() {
    return new URL(window.location.href);
  }
}

class PaginatedRouteController extends RouteController {
  constructor() {
    super();
    this.page = 1;
    this.per = 10;
    this.pages = 1;
    this.total = 0;
    this.pageStart = 0;
    this.pageEnd = 0;
  }

  getPaginatorFooterTemplate() {
    let template = "";

    if (this.total > 0) {
      template += `<div><p>${this.pageStart + 1} - ${this.pageEnd} of ${
        this.total
      }</p></div>`;
      if (this.page > 1 || this.page < this.pages) {
        template += "<div>";
        if (this.page > 1) {
          template += `<div>
          <a href="${this.getPreviousPageUrl()}" data-route="taps" data-route-params='${JSON.stringify(
            { page: this.getPreviousPage() }
          )}' class="button route-link">
            <span class="icon">${ICON_CHEVRON_LEFT}</span>
            <span class="text">Prev</span>
          </a></div>`;
        }
        if (this.page < this.pages) {
          template += `<div>
          <a href="${this.getNextPageUrl()}" data-route="taps" data-route-params='${JSON.stringify(
            { page: this.getNextPage() }
          )}' class="button route-link">
            <span class="text">Next</span>
            <span class="icon">${ICON_CHEVRON_RIGHT}</span>
          </a></div>`;
        }
        template += "</div>";
      }
    }
    return template;
  }

  getPreviousPage() {
    return this.page > 1 ? this.page - 1 : 1;
  }

  getPreviousPageUrl() {
    const url = this.getCurrentUrl();
    url.searchParams.set("page", this.getPreviousPage());
    return url;
  }

  getNextPage() {
    return this.page < this.pages ? this.page + 1 : this.pages;
  }

  getNextPageUrl() {
    const url = this.getCurrentUrl();
    url.searchParams.set("page", this.getNextPage());
    return url;
  }

  paginate(items, { page, per }) {
    this.total = items.length;
    this.page = page ?? parseInt(this.getQueryParm("page", "1"), 10);
    this.per = per ?? parseInt(this.getQueryParm("per", "10"), 10);
    this.pages = Math.ceil(items.length / this.per);
    this.pageStart = (this.page - 1) * this.per;
    this.pageEnd = this.page < this.pages ? this.page * this.per : this.total;
    const paginatedItems = [...items.slice(this.pageStart, this.pageEnd)];
    return paginatedItems;
  }
}

class Navigation extends Templateable {
  static init() {
    const nav = new Navigation();
    nav.render(null, getDomContainer());
  }
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
            <span class="icon">${ICON_FORMATTED_LIST}</span>
          </a>
        </div>
        <div class="nav-item has-sub">
          <a href="/settings" data-route="settings" class="button nav-button route-link" title="Settings">
            <span class="icon">${ICON_COG_OUTLINE}</span>
          </a>
          <div class="nav-sub">
            <h3>Manage</h3>
            <a href="/taps" data-route="taps" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_BEER_OUTLINE}</span>
              <span class="text">Taps</span>
            </a>
            <a href="/breweries" data-route="breweries" class="button nav-button route-link" title="Settings">
              <span class="icon">${ICON_BARLEY}</span>
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
