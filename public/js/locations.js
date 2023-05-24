class TapLocationsController extends PaginatedRouteController {
  prepareLocation(location) {
    const { taps } = getApp().state;
    location.tap = taps.find((t) => t.location_id === location.id);
    return location;
  }

  renderGrid({ app, params }) {
    const locations = [...this.paginate(app.state.tap_locations, params)].map(
      this.prepareLocation.bind(this)
    );

    let gridContent = `<div class="grid__item">
    <div class="grid__cell">No tap locations, please <a href="/taps/add" class="route-link">add one</a></div>
  </div>`;

    if (locations && locations.length > 0) {
      gridContent = locations
        .map(
          (location) => `<div class="grid__item">
      <div class="grid__cell name">
        <h2>${location.name}</h2>
        ${location.tap ? `<p>${location.tap.name}</p>` : ""}
      </div>
      <div class="grid__cell tap-count">${location.percentage}%</div>
      <div class="grid__cell actions">
        <div>
        <button class="button" data-id="${location.id}" data-action="edit">
          <span class="icon"></span>
          <span class="text">Edit</span>
        </button>
        <button class="button is-icon" data-id="${
          location.id
        }" data-action="delete">
          <span class="icon">${ICON_DELETE}</span>
        </button>
        </div>
      </div>
    </div>`
        )
        .join("");
    }

    const $el = this.createElement(`<div class="container">
      <h2 class="page-title">Tap Locations</h2>
      <div class="grid">
      <div class="grid__actions has-groups">
        <div class="grid__action-group">
          <div class="grid__action">
            <a href="/taps/locations" class="button route-link" data-route="taps" title="Taps">
              <span class="icon">${ICON_CHEVRON_LEFT}</span>
              <span class="text">Taps</span>
            </a>
          </div>
        </div>
        <div class="grid__action-group">
        <div class="grid__action">
            <a href="/taps" class="button is-success route-link" data-route="add-tap" title="Create Tap">
              <span class="icon">${ICON_PLUS}</span>
              <span class="text">Create</span>
            </a>
          </div>
        </div>
      </div>
      <div class="grid__header">
        <div class="grid__cell name">Location</div>
        <div class="grid__cell ibu">Keg %</div>
        <div class="grid__cell actions"></div>
      </div>
      <div class="grid__content">
        ${gridContent}
      </div>
      <div class="grid__footer">
        ${this.getPaginatorFooterTemplate()}
      </div>
    </div>
    </div>`);

    getDomContainer().appendChild($el);
    return $el;
  }

  renderCreateForm() {}
  renderEditForm() {}
}
