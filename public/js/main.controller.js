class MainController extends RouteController {
  async refresh() {
    if (!this.loading) {
      this.loading = true;
      this.showSpinner();
      const { store } = getApp();
      await store.dispatch("getDrinks");
      await store.dispatch("getBreweries");
      await store.dispatch("getTaps");
      this.removeSpinner();
      this.loading = false;
    }
  }

  renderListItem(drink, app) {
    const image = app.Templates.imageTemplate(drink.image);
    const breweryImage = app.Templates.imageTemplate(drink.brewery_image);
    const cssClasses = ["drink"];

    if (image !== "") {
      cssClasses.push("has-image");
    }

    const tap = app.store.getState().taps.find((t) => t.id === drink.tap_id);
    let keg_date = tap.keg_date ? tap.keg_date : null;
    if (keg_date) {
      const kd = new Date(keg_date);
      keg_date = `${kd.getMonth() + 1}/${kd.getDate()}/${kd.getFullYear()}`;
    }

    return `
        <div class="${cssClasses.join(" ")}">
          ${image !== "" ? `<div class="drink__image">${image}</div>` : ""}
          <div class="drink__content">
            <div class="drink__content-header">
              <div class="keg__image">${breweryImage}</div>
              <div class="keg__header">
                <p class="keg__location">${tap.name}</p>
                <h2 class="keg__name">${drink.name}</h2>
                <p class="keg__brewery">${drink.brewery_name}</p>
              </div>
            </div>
            <div class="drink__content-footer">
              <div class="keg__detail"><h3>${drink.style}</h3></div>
              <div class="keg__detail">
                <p><span class="icon">${ICON_KEG}</span></p>
                <h3>${tap.percentage}%</h3>
              </div>
              <div class="keg__detail"><p>ABV</p><h3>${drink.abv}%</h3></div>
              <div class="keg__detail"><p>IBUS</p><h3>${drink.ibu}</h3></div>
              <div class="keg__detail"><p>Kegged</p><h3>${keg_date}</h3></div>
            </div>
          </div>
        </div>
      `;
  }

  async renderHome({ app }) {
    await this.refresh();
    const { drinks, breweries, taps } = app.store.getState();
    const filteredItems = isArray(drinks)
      ? drinks.filter((d) => taps.find((t) => t.id === d.tap_id && t.active))
      : [];
    const $el = this.createElement(`<div class="drinks"></div>`);

    if (filteredItems.length > 0) {
      filteredItems.map((t) =>
        $el.appendChild(this.createElement(this.renderListItem(t, app)))
      );
    } else if (breweries && breweries.length === 0) {
      $el.appendChild(
        this.createElement(
          `<p>No breweries found! <a class="route-link" data-route="add-brewery">Create one</a></p>`
        )
      );
    } else if (drinks && drinks.length === 0) {
      $el.appendChild(
        this.createElement(
          `<p>No Drinks found! <a class="route-link" data-route="add-drink">Create one</a></p>`
        )
      );
    } else {
      $el.appendChild(
        this.createElement(
          `<p>No <strong>active</strong> drinks found! <a class="route-link" data-route="drinks">Manage</a></p>`
        )
      );
    }
    getDomContainer().appendChild($el);
    return $el;
  }
}
