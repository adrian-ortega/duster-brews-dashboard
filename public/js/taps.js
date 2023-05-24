class TapsController extends PaginatedRouteController {
  prepareTap(tap) {
    const image = tap.media.find((m) => m.primary);
    const brewery = this.getBrewery(tap.brewery_id);
    const bImage = brewery.media.find((m) => m.primary);
    return {
      ...tap,
      brewery,
      ibu: parseInt(tap.ibu),
      abv: parseFloat(tap.abv).toFixed(1),
      image: { src: image ? image.src : null, alt: tap.name },
      brewery_image: { src: bImage ? bImage.src : null, alt: brewery.name },
    };
  }

  renderGrid({ app, router, params }) {
    const taps = [...this.paginate(app.state.taps, params)].map(
      this.prepareTap.bind(this)
    );
    let gridContent = `<div class="grid__item"><div class="grid__cell none">You have no taps, <a href="/taps/add" class="route-link">create one</a></div></div>`;
    if (taps && taps.length > 0) {
      gridContent = taps
        .map(
          (tap) => `
      <div class="grid__item">
        <div class="grid__cell name"><h2>${tap.name}</h2></div>
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
        const { meta } = await response.json();
        if (meta.status && meta.status.toLowerCase() === "updated") {
          showNotification("Tap Updated");
        }
      });
    });

    getDomContainer().appendChild($el);
    return $el;
  }

  renderList({ app }) {
    const $container = getDomContainer();
    const { taps } = app.state;
    const filteredTaps = taps
      .filter((tap) => tap.active)
      .map(this.prepareTap.bind(this));

    const tapTemplate = (tap) => {
      const tapImage = tap.image.src
        ? `<figure><span><img src="${tap.image.src}" alt="${tap.image.alt}"/></span></figure>`
        : "";
      const breweryImage = tap.brewery_image.src
        ? `<figure><span><img src="${tap.brewery_image.src}" alt="${tap.brewery_image.alt}"/></span></figure>`
        : "";
      return `
        <div class="tap">
          <div class="tap__image">${tapImage}</div>
          <div class="tap__content">
            <div class="tap__content-header">
              <div class="keg__image">${breweryImage}</div>
              <div class="keg__header">
                <p class="keg__location">KEG LOCATION</p>
                <h2 class="keg__name">${tap.name}</h2>
                <p class="keg__brewery">${tap.brewery.name}</p>
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
    };

    const $el = this.createElement(
      `<div class="taps">${
        filteredTaps.length
          ? filteredTaps.map(tapTemplate).join("")
          : `<p>You have no taps, <a href="/settings/add-tap" class="router-link" data-route="add-tap">Create one</a></p>`
      }</div>`
    );

    $container.appendChild($el);
    return $el;
  }

  renderCreateForm() {}

  renderEditForm({ params, router }) {
    const $container = getDomContainer();
    const { id } = params;
    //@TODO reject taps that don't exists
    const tap = this.getTap(id);
    const $el = this.createElement(`
    <div class="container">
      <div class="settings__container">
        <h2 class="settings__title">Edit Tap</h2>
          <form class="settings__form" method="post" action="/">
            <div class="settings__content">
              <div class="settings__view"></div>
            </div>
            <div class="settings__footer">
              <button type="submit" class="button is-save is-primary">
                <span class="icon is-spinner is-hidden">${ICON_RELOAD}</span>
                <span class="text">Save</span>
              </button>
              <button class="button is-cancel">Cancel</button>
            </div>
        </form>
      </div>
    </div>
    `);

    fetch("/api/taps/fields").then(async (response) => {
      const { data } = await response.json();
      for (let i = 0; i < data.length; i++) {
        if (tap[data[i].name]) {
          data[i].value = tap[data[i].name];
        }
      }
      Forms.renderFields(data, $el.querySelector(".settings__view"));
    });

    $el.querySelector(".button.is-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      return router.goTo("taps");
    });

    const $form = $el.querySelector(".settings__form");
    $form.addEventListener("submit", (e) => {
      e.preventDefault();
      fetch("/api/taps", {
        method: "POST",
        body: new FormData($el.querySelector(".settings__form")),
      }).then((response) =>
        response.json().then(({ data, meta }) => {
          if (data.status === 422) {
            // @TODO validation failed
          } else {
            if (meta && meta.status) {
              showNotification("Tap saved");
            }
            router.goTo("taps");
          }
        })
      );
    });

    $form.appendChild(
      this.createElement(`<input type="hidden" name="id" value="${tap.id}"/>`)
    );
    $container.appendChild($el);
    return $el;
  }
}
