class MainController extends RouteController {
  async refresh() {
    this.showSpinner();
    try {
      const { data: tData } = await apiGet("/api/taps");
      window[window.APP_NS].state.taps = tData;
      const { data: bData } = await apiGet("/api/breweries");
      window[window.APP_NS].state.breweries = bData;
    } catch (e) {
      window[window.APP_NS].state.taps = [];
      window[window.APP_NS].state.breweries = [];
    }
    this.removeSpinner();
  }

  renderListItem(tap, app) {
    const tapImage = app.Templates.imageTemplate(tap.image);
    const breweryImage = app.Templates.imageTemplate(tap.brewery_image);
    return `
        <div class="tap">
          <div class="tap__image">${tapImage}</div>
          <div class="tap__content">
            <div class="tap__content-header">
              <div class="keg__image">${breweryImage}</div>
              <div class="keg__header">
                <p class="keg__location">KEG LOCATION</p>
                <h2 class="keg__name">${tap.name}</h2>
                <p class="keg__brewery">${tap.brewery_name}</p>
              </div>
            </div>
            <div class="tap__content-footer">
              <div class="keg__detail"><h3>${tap.style}</h3></div>
              <div class="keg__detail">
                <p><span class="icon">${ICON_KEG}</span></p>
                <h3>0.0%</h3>
              </div>
              <div class="keg__detail"><p>ABV</p><h3>${tap.abv}%</h3></div>
              <div class="keg__detail"><p>IBUS</p><h3>${tap.ibu}</h3></div>
              <div class="keg__detail"><p>Kegged</p><h3>KEG DATE</h3></div>
            </div>
          </div>
        </div>
      `;
  }

  async renderHome({ app }) {
    this.refresh();
    const { taps, breweries } = app.state;
    const filteredTaps = isArray(taps) ? taps.filter((t) => t.active) : [];
    const $el = this.createElement(`<div class="taps"></div>`);
    if (filteredTaps.length > 0) {
      $el.appendChild(
        this.createElement(
          filteredTaps.map((t) => this.renderListItem(t, app)).join("")
        )
      );
    } else if (breweries && breweries.length === 0) {
      $el.appendChild(
        this.createElement(
          `<p>No breweries found! <a class="route-link" data-route="add-brewery">Create one</a></p>`
        )
      );
    } else if (taps && taps.length === 0) {
      $el.appendChild(
        this.createElement(
          `<p>No Taps found! <a class="route-link" data-route="add-tap">Create one</a></p>`
        )
      );
    } else {
      $el.appendChild(
        this.createElement(
          `<p>No <strong>active</strong> taps found! <a class="route-link" data-route="taps">Manage</a></p>`
        )
      );
    }
    getDomContainer().appendChild($el);
    return $el;
  }
}
