const renderResetBreweriesContainer = () => {
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
  const $container = renderResetBeersContainer();
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
              <button class="button is-cancel">Cancel</button>
            </div>
        </form>
      </div>`)
  );

  fetch("/api/breweries/fields").then(async (response) => {
    const { data } = await response.json();
    Forms.renderFields(data, $container.querySelector(".settings__view"));
  });
};

const renderEditBreweriesForm = () => {};
