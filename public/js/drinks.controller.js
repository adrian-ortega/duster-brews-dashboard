class DrinksController extends PaginatedRouteController {
  async refresh() {
    if (!this.loading) {
      this.loading = true;
      this.showSpinner();
      const { store } = window[window.APP_NS];
      await store.dispatch("getDrinks");
      await store.dispatch("getBreweries");
      this.removeSpinner();
      this.loading = false;
    }
  }

  async renderGrid({ app, router, params }) {
    await this.refresh();
    let { drinks } = app.store.getState();
    drinks = [...this.paginate(drinks, params)];
    let gridContent = `<div class="grid__item"><div class="grid__cell none">You have no Drinks set up, <a data-route="add-drink" class="route-link">create one</a></div></div>`;
    console.log(drinks);
    if (drinks && drinks.length > 0) {
      gridContent = drinks
        .map(
          (drink) => `
      <div class="grid__item">
        <div class="grid__cell name">
          <div class="item${drink.image ? " has-image" : ""}">
            ${app.Templates.imageTemplate(drink.image)}
            <div class="item__content">
              <h2>${drink.name}</h2>
              <p>${drink.style}</p>
            </div>
          </div>
        </div>
        <div class="grid__cell abv">${drink.abv}</div>
        <div class="grid__cell ibu">${drink.ibu}</div>
        <div class="grid__cell active">
          <label class="switch">
            <input type="checkbox" value="1" ${
              drink.active ? 'checked="checked"' : ""
            } data-id="${drink.id}"/>
            <span></span>
          </label>
        </div>
        <div class="grid__cell actions">
          <div>
            <button class="button" data-id="${drink.id}" data-action="edit">
              <span class="icon"></span>
              <span class="text">Edit</span>
            </button>
            <button class="button is-icon" data-id="${
              drink.id
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
    <div class="settings__container">
      <h2 class="page-title">Drinks</h2>
      <div class="grid">
        <div class="grid__actions">
          <div class="grid__action-group">
            <div class="grid__action">
              <a href="/taps/taps" class="button route-link" data-route="taps" title="Taps">
                <span class="icon">${ICON_FAUCET}</span>
                <span class="text">Taps</span>
              </a>
            </div>
            <div class="grid__action">
              <a href="/breweries" class="button route-link" data-route="breweries" title="Breweries">
                <span class="icon">${ICON_BARLEY}</span>
                <span class="text">Breweries</span>
              </a>
            </div>
            <div class="grid__action">
              <a href="/create-drink" class="button is-success route-link" data-route="add-drink" title="Add Drink">
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
              if (confirm("Are you sure you want to delete this Drink?")) {
                fetch(`/api/drinks/${id}`, { method: "DELETE" })
                  .then((response) => response.json())
                  .then(({ data }) => {
                    if (data.status.toLowerCase() === "success") {
                      showNotification("Drink was uccessfully deleted.");
                      router.goTo("drinks");
                    }
                  });
              }
              break;
            case "edit":
              router.goTo("edit-drink", { id });
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
        const response = await fetch("/api/drinks/toggle", {
          method: "POST",
          body,
        });
        const { data } = await response.json();
        if (data.status && data.status.toLowerCase() === "updated") {
          showNotification("Drink Updated");
        }
      });
    });

    getDomContainer().appendChild($el);
    return $el;
  }

  async renderCreateForm({ app, router }) {
    const $el = this.createElement(DrinksController.FORM_TEMPLATE);
    const fields = await app.store.dispatch("getDrinkFields");

    $el.querySelector(".settings__title").innerHTML = "Create Drink";
    Forms.renderFields(fields, $el.querySelector(".settings__view"));

    $el.querySelector(".button.is-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      return router.goTo("drinks");
    });

    $el
      .querySelector(".settings__form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const response = await fetch("/api/drinks", {
          method: "POST",
          body: new FormData($el.querySelector(".settings__form")),
        });
        const { data, meta } = await response.json();
        if (data.status === 422) {
          // @TODO validation failed
        } else {
          if (meta && meta.status) {
            showNotification("Drink saved");
          }
          router.goTo("drinks");
        }
      });

    getDomContainer().appendChild($el);
    return $el;
  }

  async renderEditForm({ params, router, app }) {
    const drink = await app.store.dispatch("getDrink", params.id);
    if (!drink) {
      showNotification("Drink not found", "warning");
      return router.goTo("drinks");
    }

    const $el = await this.renderCreateForm({ router, app });
    $el.querySelector(".settings__title").innerHTML = "Edit Drink";
    app.Forms.fillFields(
      await app.store.dispatch("getDrinkFields"),
      drink,
      $el
    );

    $el
      .querySelector(".settings__form")
      .appendChild(
        this.createElement(
          `<input type="hidden" name="id" value="${drink.id}"/>`
        )
      );

    return $el;
  }
}
