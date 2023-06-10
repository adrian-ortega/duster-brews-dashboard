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

  getQueryParam(key, defaultValue = "") {
    if (!this.queryParams) {
      this.queryParams = new URLSearchParams(window.location.search);
    }

    return this.queryParams.has(key) ? this.queryParams.get(key) : defaultValue;
  }

  getCurrentUrl() {
    return new URL(window.location.href);
  }

  showSpinner() {
    this.removeSpinner();
    getDomContainer().appendChild(
      this.createElement(
        `<div class="loading-spinner">
        <div class="lds-ripple"><div></div><div></div></div>
      </div>`
      )
    );
  }

  removeSpinner() {
    const $el = document.querySelector(".loading-spinner");
    if ($el) {
      $el.parentNode.removeChild($el);
    }
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

  static get TABLE_TEMPLATE() {
    return `<div class="container"><div class="settings__container">
      <h2 class="page-title">Table</h2>
      <div class="grid">
        <div class="grid__actions"></div>
        <div class="grid__header"></div>
        <div class="grid__content"></div>
        <div class="grid__footer"></div>
      </div>
    </div></div>`;
  }

  getPaginatorFooterTemplate() {
    let template = "<div></div>";

    if (this.total > 0) {
      template = `<div><p>${this.pageStart + 1} - ${this.pageEnd} of ${
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
    this.total = isArray(items) ? items.length : 0;
    this.page = page ?? parseInt(this.getQueryParam("page", "1"), 10);
    this.per = per ?? parseInt(this.getQueryParam("per", "10"), 10);
    this.pages = this.total === 0 ? 1 : Math.ceil(this.total / this.per);
    this.pageStart = (this.page - 1) * this.per;
    this.pageEnd = this.page < this.pages ? this.page * this.per : this.total;
    const paginatedItems = isArray(items)
      ? [...items.slice(this.pageStart, this.pageEnd)]
      : [];
    return paginatedItems;
  }
}
