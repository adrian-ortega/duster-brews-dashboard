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
  const $form = $container.querySelector(".settings__view");
  const fields = [
    {
      label: "Name",
      name: "name",
      value: null,
      type: "text",
    },
    {
      label: "Brewery",
      name: "brewery_id",
      value: null,
      type: "select",
      options: [],
    },
    {
      label: "Style",
      name: "style",
      value: null,
      type: "text",
    },
    {
      label: "Gravity Start",
      name: "gravity_start",
      value: null,
      type: "text",
    },
    {
      label: "Gravity End",
      name: "gravity_end",
      value: null,
      type: "text",
    },
    {
      label: "ABV",
      name: "abv",
      value: null,
      type: "text",
    },
    {
      label: "IBU",
      name: "ibu",
      value: null,
      type: "text",
    },
  ];

  fields.forEach((field) => {
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
};

const renderEditBeersForm = () => {};
