class TapsController extends PaginatedRouteController {
  async refresh() {
    if (!this.loading) {
      this.loading = true;
      this.showSpinner();
      const { store } = window[window.APP_NS];
      await store.dispatch("getTaps");
      await store.dispatch("getBrewereries");
      this.removeSpinner();
      this.loading = false;
    }
  }

  async getFields() {
    return fetch("/api/taps/fields")
      .then((res) => res.json())
      .then(({ data }) => data);
  }

  async renderGrid({ app, router, params }) {
    await this.refresh();
    let { taps } = app.store.getState();
    taps = [...this.paginate(taps, params)];
    let gridContent = `<div class="grid__item"><div class="grid__cell none">You have no taps, <a data-route="add-tap" class="route-link">create one</a></div></div>`;
    if (taps && taps.length > 0) {
      gridContent = taps
        .map(
          (tap) => `
      <div class="grid__item">
        <div class="grid__cell name">
          <div class="item${tap.image ? " has-image" : ""}">
            ${app.Templates.imageTemplate(tap.image)}
            <div class="item__content">
              <h2>${tap.name}</h2>
              <p>${tap.style}</p>
            </div>
          </div>
        </div>
        <div class="grid__cell abv">${tap.abv}</div>
        <div class="grid__cell ibu">${tap.ibu}</div>
        <div class="grid__cell active">
          <label class="switch">
            <input type="checkbox" value="1" ${
              tap.active ? 'checked="checked"' : ""
            } data-id="${tap.id}"/>
            <span></span>
          </label>
        </div>
        <div class="grid__cell actions">
          <div>
            <button class="button" data-id="${tap.id}" data-action="edit">
              <span class="icon"></span>
              <span class="text">Edit</span>
            </button>
            <button class="button is-icon" data-id="${
              tap.id
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
    <h2 class="page-title">Taps</h2>
    <div class="grid">
      <div class="grid__actions">
        <div class="grid__action-group">
          <div class="grid__action">
            <a href="/taps/locations" class="button route-link" data-route="locations" title="Tap locations">
              <span class="icon">${ICON_FAUCET}</span>
              <span class="text">Locations</span>
            </a>
          </div>
          <div class="grid__action">
            <a href="/breweries" class="button route-link" data-route="breweries" title="Breweries">
              <span class="icon">${ICON_BARLEY}</span>
              <span class="text">Breweries</span>
            </a>
          </div>
          <div class="grid__action">
            <a href="/create-tap" class="button is-success route-link" data-route="add-tap" title="Add Tap">
              <span class="icon">${ICON_PLUS}</span>
              <span class="text">Create</span>
            </a>
          </div>
        </div>
      </div>
      <div class="grid__header">
        <div class="grid__cell name">Beer</div>
        <div class="grid__cell abv">ABV</div>
        <div class="grid__cell ibu">IBU</div>
        <div class="grid__cell active">Active</div>
        <div class="grid__cell actions"></div>
      </div>
      <div class="grid__content">
        ${gridContent}
      </div>
      <div class="grid__footer">
        ${this.getPaginatorFooterTemplate()}
      </div>
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
              if (confirm("Are you sure you want to delete this tap?")) {
                fetch(`/api/taps/${id}`, { method: "DELETE" })
                  .then((response) => response.json())
                  .then(({ data }) => {
                    if (data.status.toLowerCase() === "success") {
                      showNotification("Tap was uccessfully deleted.");
                      app.fireAction("refresh");
                      const $row = $btn.closest(".grid__item");
                      $row.parentNode.removeChild($row);
                    }
                  });
              }
              break;
            case "edit":
              router.goTo("edit-tap", { id });
              break;
          }
        }
      }
    });

    [...$el.querySelectorAll("input[data-id]")].forEach(($input) => {
      $input.addEventListener("change", async (e) => {
        const body = new FormData();
        body.append("id", e.target.getAttribute("data-id"));
        body.append("active", e.target.checked);
        const response = await fetch("/api/taps/toggle", {
          method: "POST",
          body,
        });
        const { data } = await response.json();
        if (data.status && data.status.toLowerCase() === "updated") {
          showNotification("Tap Updated");
        }
      });
    });

    getDomContainer().appendChild($el);
    return $el;
  }

  async renderCreateForm({ router }) {
    const $el = this.createElement(TapsController.FORM_TEMPLATE);
    const fields = await this.getFields();

    $el.querySelector(".settings__title").innerHTML = "Create Tap";
    Forms.renderFields(fields, $el.querySelector(".settings__view"));

    $el.querySelector(".button.is-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      return router.goTo("taps");
    });

    $el
      .querySelector(".settings__form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const response = await fetch("/api/taps", {
          method: "POST",
          body: new FormData($el.querySelector(".settings__form")),
        });
        const { data, meta } = await response.json();
        if (data.status === 422) {
          // @TODO validation failed
        } else {
          if (meta && meta.status) {
            showNotification("Tap saved");
          }
          router.goTo("taps");
        }
      });

    getDomContainer().appendChild($el);
    return $el;
  }

  async renderEditForm({ params, router, app }) {
    const tap = await this.getTap(params.id);
    if (!tap) {
      showNotification("Tap not found", "warning");
      return router.goTo("taps");
    }

    const $el = await this.renderCreateForm({ router, app });
    $el.querySelector(".settings__title").innerHTML = "Edit Tap";
    app.Forms.fillFields(await this.getFields(), tap, $el);

    $el
      .querySelector(".settings__form")
      .appendChild(
        this.createElement(`<input type="hidden" name="id" value="${tap.id}"/>`)
      );

    return $el;
  }
}
