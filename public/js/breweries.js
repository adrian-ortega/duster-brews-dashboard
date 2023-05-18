/**
 * Returns a brewery object by ID
 * @param {String} id 
 * @returns {Object}
 */
const getBrewery = (id) =>
  window[window.APP_NS].state?.breweries.find((b) => b.id === id);

/**
 * Queries for the Breweries edit container or creates it and returns it.
 * @returns {Element}
 */
const resetBreweriesContainer = () => {
  const $container = getDomContainer();
  let $breweriesContainer = $container.querySelector(".brewery-edit");
  if ($breweriesContainer) {
    $breweriesContainer.innerHTML = "";
  } else {
    $breweriesContainer = createElementFromTemplate(
      `<div class="brewery-edit edit-container container"></div>`
    );
  }
  $container.appendChild($breweriesContainer);
  return $breweriesContainer;
};

const renderCreateBreweryForm = () => {
  const $container = resetBreweriesContainer();
  $container.appendChild(
    createElementFromTemplate(`<div class="settings__container">
        <h2 class="settings__title">Create Brewery</h2>
          <form class="settings__form" method="post" action="/">
            <div class="settings__content">
              <div class="settings__view"></div>
            </div>
            <div class="settings__footer">
              <button type="submit" class="button is-save is-primary">
                <span class="icon is-spinner is-hidden">${ICON_RELOAD}</span>
                <span class="text">Save</span>
              </button>
              <button type="submit" class="button is-save-plus">
                <span class="icon is-spinner is-hidden">${ICON_RELOAD}</span>
                <span class="text">Save + another</span>
              </button>
              <button class="button is-cancel">Cancel</button>
            </div>
        </form>
      </div>`)
  );

  fetch("/api/breweries/fields").then(async (response) => {
    const { data } = await response.json();
    Forms.renderFields(data, $container.querySelector(".settings__view"));
  });

  $container
    .querySelector(".settings__form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      fetch("/api/breweries", {
        method: "POST",
        body: new FormData(e.target),
      }).then(() => {
        if (e.submitter && e.submitter.classList.contains("is-save-plus")) {
          fireCustomEvent("AddBrewery");
        } else {
          fireCustomEvent("ShowTaps");
        }
      });
    });

  return $container.querySelector(".settings__container");
};

const renderFirstTimeBreweries = () => {
  removeWidgetsContainer();
  const $container = renderCreateBreweryForm();
  const $title = $container.querySelector(".settings__title");
  $title.classList.add("is-first-time");
  $title.innerHTML = "Must be your first time";
  $title.after(
    createElementFromTemplate(`<div class="first-time">
      <p>Before you can add any <strong>Taps</strong>, we need to add one or more <strong>Breweries</strong>.</p>
    </div>`)
  );
  const $cancelBtn = $container.querySelector(".button.is-cancel");
  if ($cancelBtn) {
    $cancelBtn.parentNode.removeChild($cancelBtn);
  }
};

const renderEditBreweriesForm = () => {};
