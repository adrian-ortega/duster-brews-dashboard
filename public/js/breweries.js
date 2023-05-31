class BreweriesController extends PaginatedRouteController {
  prepareBrewery(brewery) {
    brewery.count = getApp().state.taps.reduce(
      (c, { brewery_id, active }) => {
        if (brewery_id === brewery.id) {
          ++c.total;
          if (active) ++c.active;
        }
        return c;
      },
      {
        active: 0,
        total: 0,
      }
    );
    return brewery;
  }
  renderGrid({ app, router, params }) {
    const breweries = [...this.paginate(app.state.breweries, params)].map(
      this.prepareBrewery.bind(this)
    );
    let gridContent = `<div class="grid__item">
      <div class="grid__cell">No Breweries, <a class="route-link" data-route="add-brewery">create one</a>.</div>
    </div>`;

    if (breweries && breweries.length > 0) {
      gridContent = breweries.map((brewery) => `<div class="grid__item">
        <div class="grid__cell name"><h2>${brewery.name}</h2></div>
        <div class="grid__cell tap-count">${brewery.count.active}/${brewery.count.total}</div>
        <div class="grid__cell actions">
          <div>
          <button class="button" data-id="${brewery.id}" data-action="edit">
            <span class="icon"></span>
            <span class="text">Edit</span>
          </button>
          <button class="button is-icon" data-id="${brewery.id}" data-action="delete">
            <span class="icon">${ICON_DELETE}</span>
          </button>
          </div>
        </div>
      </div>`).join("");
    }

    const $el = this.createElement(`<div class="container">
      <h2 class="page-title">Breweries</h2>
      <div class="grid">
        <div class="grid__actions">
          <div class="grid__action-group"></div>
          <div class="grid__action-group">
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
  renderList() {
    const $el = this.createElement(`<div class="container">List</div>`);
    getDomContainer().appendChild($el);
    return $el;
  }
  renderCreateForm() {
    const $el = this.createElement(`<div class="container">Create Brewery</div>`);
    getDomContainer().appendChild($el);
    return $el;
  }
  renderEditForm() {
    const $el = this.createElement(`<div class="container">Edit Brewery</div>`);
    getDomContainer().appendChild($el);
    return $el;
  }
}
