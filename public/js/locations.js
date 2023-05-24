class TapLocationsController extends PaginatedRouteController {
  prepareLocation(location) {
    const { taps } = getApp().state;
    location.tap = taps.find((t) => t.location_id === location.id);
    return location;
  }

  renderGrid({ app, params, router }) {
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

    $el.addEventListener("click", (e) => {
      const $el = e.target;
      if (
        $el.matches(
          ".grid__item .button[data-action], .grid__item .button[data-action] *"
        )
      ) {
        const $btn = $el.classList.contains(".button")
          ? $el
          : $el.closest(".button");
        const id = $btn.getAttribute("data-id");
        if (id) {
          e.preventDefault();
          const action = $btn.getAttribute("data-action");
          switch (action) {
            case "delete":
              if (confirm("Are you sure you want to delete this location?")) {
                fetch(`/api/taps/locations/${id}`, { method: "DELETE" })
                  .then((response) => response.json())
                  .then(({ data }) => {
                    if (data.status.toLowerCase() === "success") {
                      showNotification("Tap Location was uccessfully deleted.");
                      app.fireAction("refresh");
                      const $row = $btn.closest(".grid__item");
                      $row.parentNode.removeChild($row);
                    }
                  });
              }
              break;
            case "edit":
              router.goTo("edit-location", { id });
              break;
          }
        }
      }
    });

    getDomContainer().appendChild($el);
    return $el;
  }

  renderCreateForm() {
    const $el = this.createElement(
      `<div class="container">Create Location</div>`
    );
    getDomContainer().appendChild($el);
    return $el;
  }

  renderEditForm() {
    const $el = this.createElement(
      `<div class="container">Edit Location</div>`
    );
    getDomContainer().appendChild($el);
    return $el;
  }
}
