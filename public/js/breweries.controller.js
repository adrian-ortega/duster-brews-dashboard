class BreweriesController extends PaginatedRouteController {
  async autoGenerate({ target, app }) {
    const startedAt = new Date();
    let reset = NOOP;
    if (target) {
      const $form = target.closest("form");
      if ($form) {
        [...$form.querySelectorAll(".button")].forEach(($b) => {
          $b.classList.add("disabled");
          $b.setAttribute("disabled", "disabled");
          $b.disabled = true;
        });
        let jokeId, eId;
        const $spinner = app.createElement(
          `<div class="loading-spinner">
            <span class="progress"></span>
            <span class="title">Do you like Jokes?🤔 This might take a while.</span>
            <span class="icon is-spinner">${ICON_RELOAD}</span>
          </div>`
        );
        $form.appendChild($spinner);
        const getElapsedTime = () => {
          const pad = (n) => (n < 10 ? `0${n}` : n);
          const now = new Date();
          let diff = now.getTime() - startedAt.getTime();
          const m = Math.floor(diff / (1000 * 60));
          diff -= m * (1000 * 60);
          const s = Math.floor(diff / 1000);
          $spinner.querySelector(".progress").innerHTML = `Time Elapsed ${pad(
            m
          )}:${pad(s)}`;
          eId = setTimeout(getElapsedTime, 100);
        };
        const getJoke = () => {
          fetch("/api/joke")
            .then((r) => r.json())
            .then(({ data }) => {
              $spinner.querySelector(".title").innerHTML = data;
              jokeId = setTimeout(getJoke, 30000);
            });
        };
        eId = setTimeout(getElapsedTime, 100);
        jokeId = setTimeout(getJoke, 10000);
        reset = () => {
          [...$form.querySelectorAll(".button")].forEach(($b) => {
            $b.classList.remove("disabled");
            $b.removeAttribute("disabled");
            $b.disabled = false;
          });
          $form.removeChild($spinner);
          clearTimeout(jokeId);
          clearTimeout(eId);
        };
      }
    }

    const response = await fetch("/api/breweries/generate", { method: "POST" });
    const data = await response.json();
    reset();
    console.log(data);
  }

  async getFields() {
    const { data } = await apiGet("/api/breweries/fields");
    return data;
  }

  async refresh() {
    if (!this.loading) {
      this.loading = true;
      this.showSpinner();
      const { store } = getApp();
      await store.dispatch("getBreweries");
      this.removeSpinner();
      this.loading = false;
    }
  }

  async renderGrid({ app, router, params }) {
    await this.refresh();
    let { breweries } = app.store.getState();
    breweries = [...this.paginate(breweries, params)];
    let gridContent = `<div class="grid__item">
      <div class="grid__cell">No Breweries, <a class="route-link" data-route="add-brewery">create one</a>.</div>
    </div>`;

    if (breweries && breweries.length > 0) {
      gridContent = breweries
        .map(
          (brewery) => `<div class="grid__item">
        <div class="grid__cell name">
          <div class="item${brewery.image ? " has-image" : ""}">
            ${app.Templates.imageTemplate(brewery.image)}
            <div class="item__content"><h2>${brewery.name}</h2></div>
          </div>
        </div>
        <div class="grid__cell tap-count">${brewery.count.active}/${
            brewery.count.total
          }</div>
        <div class="grid__cell actions">
          <div>
          <button class="button" data-id="${brewery.id}" data-action="edit">
            <span class="icon"></span>
            <span class="text">Edit</span>
          </button>
          <button class="button is-icon" data-id="${
            brewery.id
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
      <h2 class="page-title">Breweries</h2>
      <div class="grid">
        <div class="grid__actions">
          <div class="grid__action-group"></div>
          <div class="grid__action-group">
            <div class="grid__action">
              <a href="/taps" class="button route-link" data-route="locations">
                <span class="icon">${ICON_FAUCET}</span>
                <span class="text">Locations</span>
              </a>
            </div>
            <div class="grid__action">
              <a href="/taps" class="button route-link" data-route="taps">
                <span class="icon">${ICON_BEER_OUTLINE}</span>
                <span class="text">Taps</span>
              </a>
            </div>
            <div class="grid__action">
              <a href="/create-brewery" class="button is-success route-link" data-route="add-brewery">
                <span class="icon">${ICON_PLUS}</span>
                <span class="text">Create</span>
              </a>
            </div>
          </div>
        </div>
        <div class="grid__header">
          <div class="grid__cell name">Brewery</div>
          <div class="grid__cell tap-count">Taps</div>
          <div class="grid__cell actions">&nbsp;</div>
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
        console.log(id);
        if (id) {
          e.preventDefault();
          const action = $btn.getAttribute("data-action");
          switch (action) {
            case "delete":
              if (confirm("Are you sure you want to delete this brewery?")) {
                fetch(`/api/brewery/${id}`, { method: "DELETE" })
                  .then((response) => response.json())
                  .then(({ data }) => {
                    if (data.status.toLowerCase() === "success") {
                      showNotification("Brewery was uccessfully deleted.");
                      app.fireAction("refresh");
                      const $row = $btn.closest(".grid__item");
                      $row.parentNode.removeChild($row);
                    }
                  });
              }
              break;
            case "edit":
              router.goTo("edit-brewery", { id });
              break;
          }
        }
      }
    });

    getDomContainer().appendChild($el);
    return $el;
  }

  async renderCreateForm({ router, app }) {
    const $el = this.createElement(BreweriesController.FORM_TEMPLATE);
    const fields = await this.getFields();
    $el.querySelector(".settings__title").innerHTML = "Create Brewery";
    app.Forms.renderFields(fields, $el.querySelector(".settings__view"));

    $el.querySelector(".button.is-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      return router.goTo("breweries");
    });

    $el
      .querySelector(".settings__form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const response = await fetch("/api/breweries", {
          method: "POST",
          body: new FormData($el.querySelector(".settings__form")),
        });
        const { data, meta } = await response.json();
        if (data.status === 422) {
          // @TODO validation failed
        } else {
          if (meta && meta.status) {
            showNotification("Brewery saved");
          }
          router.goTo("breweries");
        }
      });

    getDomContainer().appendChild($el);
    return $el;
  }

  async renderEditForm({ router, app, params }) {
    const brewery = await this.getBrewery(params.id);
    if (!brewery) {
      showNotification("Brewery not found", "warning");
      return router.goTo("breweries");
    }

    const $el = await this.renderCreateForm({ router, app });
    $el.querySelector(".settings__title").innerHTML = "Edit Brewery";
    app.Forms.fillFields(await this.getFields(), brewery, $el);

    $el
      .querySelector(".settings__form")
      .appendChild(
        this.createElement(
          `<input type="hidden" name="id" value="${brewery.id}"/>`
        )
      );

    return $el;
  }
}
