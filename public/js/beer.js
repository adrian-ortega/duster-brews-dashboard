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
    const $form = $container.querySelector(".settings__view");
    data.forEach((field) => {
      let $field;
      const fieldOpts = { ...field, id: field.name };
      switch (field.type) {
        case "select":
          $field = Forms.renderSelectField(field.label, field.value, fieldOpts);
          break;
        case "image":
          $field = Forms.renderImageField(field.label, field.value, fieldOpts);
          break;
        case "text":
        default:
          $field = Forms.renderTextField(field.label, field.value, fieldOpts);
          break;
      }
      $form.appendChild($field);
    });
  });
};

const renderEditBeersForm = () => {};
