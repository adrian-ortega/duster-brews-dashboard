class RouteController extends Templateable {
  static get FORM_TEMPLATE() {
    return `<div class="container">
    <div class="settings__container">
      <h2 class="settings__title"></h2>
      <form class="settings__form" method="post" action="/">
        <div class="settings__content"><div class="settings__view"></div></div>
        <div class="settings__footer">
          <button type="submit" class="button is-save is-primary">
            <span class="icon is-spinner is-hidden">${ICON_RELOAD}</span>
            <span class="text">Save</span>
          </button>
          <button class="button is-cancel">Cancel</button>
      </div>
      </form>
    </div>
    </div>`;
  }

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

  getFields() {
    return [];
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
