const renderResetBeersContainer = () => {
  const $container = getDomContainer();
  let $beerContainer = $container.querySelector(".beer-edit");
  if ($beerContainer) {
    $beerContainer.innerHTML = "";
  } else {
    $beerContainer = createElementFromTemplate(
      `<div class="beer-edit edit-container container"></div>`
    );
  }
  $container.appendChild($beerContainer);
  return $beerContainer;
};

const renderCreateBeerForm = () => {
  const $container = renderResetBeersContainer();
  $container.appendChild(
    createElementFromTemplate(`<div class="settings__container">
      <h2 class="settings__title">Create Beer</h2>
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

  fetch("/api/beer/fields").then(async (response) => {
    const { data } = await response.json();
    Forms.renderFields(data, $container.querySelector(".settings__view"));
  });
};

const renderEditBeersForm = () => {};
