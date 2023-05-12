const renderResetBeersContainer = () => {
  const $container = getDomContainer();
  let $settings = $container.querySelector(".settings");
  if ($settings) {
    $settings.innerHTML = "";
  } else {
    $settings = createElementFromTemplate(
      `<div class="beer-edit container"></div>`
    );
  }
  $container.appendChild($settings);
  return $settings;
};
const renderCreateBeerForm = () => {
  const $container = renderResetBeersContainer();
  $container.appendChild(
    createElementFromTemplate(`<div class="beer-edit__container">
      <h2 class="beer-edit__title">Create Beer</h2>
        <form class="beer-edit__form" method="post" action="/">
          <div class="beer-edit__content"></div>
          <div class="beer-edit__footer">
            <button type="submit" class="button is-save is-primary">
              <span class="icon is-spinner is-hidden">${ICON_RELOAD}</span>
              <span class="text">Save</span>
            </button>
            <button class="button is-cancel">Cancel</button>
          </div>
      </form>
    </div>`)
  );
  // const $form = $container.querySelector(".beer-edit__content");
};

const renderEditBeersForm = () => {};
