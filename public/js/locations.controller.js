class TapLocationsController extends PaginatedRouteController {
  async getFields() {
    return fetch("/api/locations/fields")
      .then((res) => res.json())
      .then(({ data }) => data);
  }

  async refresh() {
    if (!this.loading) {
      this.loading = true;
      this.showSpinner();
      const { store } = getApp();
      await store.dispatch("getLocations");
      this.removeSpinner();
      this.loading = false;
    }
  }

  async renderGrid({ app, params, router }) {
    await this.refresh();
    const { tap_locations } = app.store.getState();
    const locations = [...this.paginate(tap_locations, params)];

    let gridContent = `<div class="grid__item">
    <div class="grid__cell">No tap locations, please <a data-route="add-location" class="route-link">add one</a></div>
  </div>`;

    if (locations && locations.length > 0) {
      gridContent = locations
        .map(
          (location) => `<div class="grid__item">
          <div class="grid__cell name">
            <div class="item">
              <div class="item__content">
                <h2>${location.name}</h2>
                ${location.tap ? `<p>${location.tap.name}</p>` : ""}
              </div>
            </div>
          </div>
          <div class="grid__cell tap-count">${location.percentage}%</div>
          <div class="grid__cell actions">
            <div>
              <button class="button" data-id="${
                location.id
              }" data-action="edit">
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
        </div>
        `
        )
        .join("");
    }
    const $el = this.createElement(TapLocationsController.TABLE_TEMPLATE);
    $el.querySelector(".page-title").innerHTML = "Locations";
    $el.querySelector(".grid__actions").appendChild(
      this.createElement(`
      <div class="grid__action-group">
        <div class="grid__action">
          <a class="button route-link" data-route="taps" title="Taps">
            <span class="icon">${ICON_BEER_OUTLINE}</span>
            <span class="text">Taps</span>
          </a>
        </div>
        <div class="grid__action">
          <a class="button route-link" data-route="breweries" title="breweries">
            <span class="icon">${ICON_BARLEY}</span>
            <span class="text">Breweries</span>
          </a>
        </div>
        <div class="grid__action">
          <a class="button is-success route-link" data-route="add-location" title="Create Tap">
            <span class="icon">${ICON_PLUS}</span>
            <span class="text">Create</span>
          </a>
        </div>
      </div>
    `)
    );

    const $header = $el.querySelector(".grid__header");
    $header.appendChild(
      this.createElement(`<div class="grid__cell name">Name</div>`)
    );
    $header.appendChild(
      this.createElement(`<div class="grid__cell percentage">Per</div>`)
    );
    $header.appendChild(
      this.createElement(`<div class="grid__cell actions">&nbsp;</div>`)
    );

    $el
      .querySelector(".grid__content")
      .appendChild(this.createElement(gridContent));
    $el
      .querySelector(".grid__footer")
      .appendChild(this.createElement(this.getPaginatorFooterTemplate()));

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

  async renderCreateForm({ router, app }) {
    const $el = this.createElement(TapLocationsController.FORM_TEMPLATE);
    const fields = await this.getFields();
    $el.querySelector(".settings__title").innerHTML = "Create Tap Location";
    app.Forms.renderFields(fields, $el.querySelector(".settings__view"));

    $el.querySelector(".button.is-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      return router.goTo("locations");
    });

    $el
      .querySelector(".settings__form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const response = await fetch("/api/locations", {
          method: "POST",
          body: new FormData($el.querySelector(".settings__form")),
        });
        const { data, meta } = await response.json();
        if (data.status === 422) {
          // @TODO validation failed
        } else {
          if (meta && meta.status) {
            showNotification("Tap Location saved");
          }
          router.goTo("locations");
        }
      });
    getDomContainer().appendChild($el);
    return $el;
  }

  async renderEditForm({ router, app, params }) {
    const location = await this.getLocation(params.id);
    console.log(location);
    if (!location) {
      showNotification("Location not found", "warning");
      return router.goTo("locations");
    }
    const $el = await this.renderCreateForm({ router, app });
    $el.querySelector(".settings__title").innerHTML = "Edit Tap Location";
    app.Forms.fillFields(await this.getFields(), location, $el);

    $el
      .querySelector(".settings__form")
      .appendChild(
        this.createElement(
          `<input type="hidden" name="id" value="${location.id}"/>`
        )
      );

    return $el;
  }
}
