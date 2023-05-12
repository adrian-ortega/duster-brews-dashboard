/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const onSettingsSaveStart = () => {
  const $footer = getDomContainer().querySelector(".settings__footer");
  [...$footer.querySelectorAll(".button")].forEach(($button) => {
    $button.classList.add("disabled");
    $button.setAttribute("disabled", true);

    if ($button.classList.contains("is-save")) {
      $button.querySelector(".text").classList.add("is-hidden");
    }
  });
};

const onSettingsSave = async (e) => {
  const $form = e.target;
  const state = window[window.APP_NS].state;
  const settings = state.settings ?? {};
  const fields = settings.fields ?? {};
  Object.entries(fields).forEach(([field_id, field]) => {
    const $input = $form[field_id];
    settings[field_id] = $input.value;
  });

  const response = await fetch ("/api/settings", { method: "POST", body: new FormData($form) })
  const { data } = await response.json();

  console.log('Settings Saved', data);
};

const onSettingsSaveEnd = () => {
  const $footer = getDomContainer().querySelector(".settings__footer");
  [...$footer.querySelectorAll(".button")].forEach(($button) => {
    $button.classList.remove("disabled");
    $button.removeAttribute("disabled");
    if ($button.classList.contains("is-save")) {
      $button.querySelector(".text").classList.remove("is-hidden");
    }
  });
};

const onSettingsCancel = (e) => {
  fireCustomEvent("ShowBeers", null, e.target);
};

const settingsFieldTemplate = ({
  label,
  id,
  content = "",
  help = null,
  category = "general",
  type = "text"
}) => {
  const $field = createElementFromTemplate(`
    <div class="settings__field settings__field--${type}" data-cat="${category}">
      <div class="label"><label for="input-${id}">${label}:</label>
      ${help ? `<p>${help}</p>` : ""}
      </div>
    </div>
  `);

  $field.appendChild(
    content instanceof Element ? content : createElementFromTemplate(content)
  );

  return $field;
};

const renderSettingsText = (label, value, fieldOptions) => {
  const { id } = fieldOptions;
  return settingsFieldTemplate({
    ...fieldOptions,
    label,
    content: `<div class="input"><input type="text" id="input-${id}" name="${id}" value="${value}"/></div>`,
  });
};

const renderSettingsOptions = (label, value, fieldOptions) => {
  const { id, options } = fieldOptions;
  const transformer = (option) => {
    const oText = isObject(option) ? option.text : option;
    const oValue = isObject(option) ? option.value : option;
    const oSel = oValue === value ? ' selected="selected"' : "";
    return `<option value="${oValue}"${oSel}>${oText}</option>`;
  };
  return settingsFieldTemplate({
    ...fieldOptions,
    label,
    content: `<div class="input">
      <div class="select">
        <select id="input-${id}" name="${id}">
          ${options.map(transformer)}
        </select>
        <span for="input-${id}" class="icon">${ICON_MENU_DOWN}</span>
      </div>
    </div>`,
  });
};

const renderSettingsImage = (label, value, fieldOptions) => {
  const { id } = fieldOptions;
  const $content = createElementFromTemplate(
    `<div class="input image-input">
      <label for="input-${id}" class="image-input__preview is-hidden"><span></span></label>
      <label class="image-input__file is-hidden">
        <span class="image-input__file-l">New file:</span>
        <span class="image-input__file-v">Something.gif</span>
      </label>
      <label for="input-${id}" class="image-input__trigger">
        <input type="file" id="input-${id}" name="${id}"/>
        <span class="image-input__trigger-text">Edit</span>
      </label>
    </div>`
  );

  $content.querySelector('input').addEventListener("change", (e) => {
    const $input = e.target;
    const $text = $content.querySelector('.image-input__trigger-text');
    const $preview = $content.querySelector('.image-input__preview');
    const $file = $content.querySelector('.image-input__file');

    // @TODO language?
    $text.innerHTML = 'Change'
    console.log($input.files);

    // $preview.classList.remove('is-hidden');
    $file.classList.remove('is-hidden');
    $file.querySelector('.image-input__file-v').innerHTML = $input.files[0].name;
  });

  return settingsFieldTemplate({ ...fieldOptions, label, content: $content });
};

const renderSettingsSwitch = (label, value, fieldOptions) => {
  const { id, help } = fieldOptions;
  const checked = value ? 'checked="checked"' : "";
  const content = `<div class="input">
    <label for="input-${id}" class="checkbox">
      <input type="checkbox" id="input-${id}" name="${id}" value="1" ${checked}/>
      <span></span>
    </label>
  </div>`;
  return settingsFieldTemplate({ ...fieldOptions, label, content });
};

const renderSettingsReset = () => {
  const $container = getDomContainer();
  const $widgets = $container.querySelector(".widgets");
  if ($widgets) {
    $container.removeChild($widgets);
  }
  let $settings = $container.querySelector(".settings");
  if ($settings) {
    $settings.innerHTML = "";
  } else {
    $settings = createElementFromTemplate(`<div class="settings"></div>`);
  }
  $container.appendChild($settings);
  return $settings;
};

const renderSettings = () => {
  const $settings = renderSettingsReset();
  const state = window[window.APP_NS].state;
  const settings = state.settings ?? {};
  const categories = settings.categories ?? {};
  let active_category_id = 'appearance'; // Object.keys(categories)[0];

  $settings.appendChild(
    createElementFromTemplate(`
    <div class="settings__container">
      <h2 class="settings__title">Settings</h2>
      <form class="settings__form" method="post" action="/">
        <div class="settings_content">
          <div class="settings__tabs"><nav></nav></div>
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
    `)
  );
  const $settingsForm = $settings.querySelector(".settings_content");
  const settingsTabsView = $settingsForm.querySelector(".settings__view");

  Object.entries(categories)
    .sort((a, b) => a.order - b.order)
    .forEach(([category_id, category]) => {
      const $trigger = createElementFromTemplate(
        `<a href="#" class="settings__tab-trigger${
          category_id === active_category_id ? " is-active" : ""
        }" data-id="${category_id}"><span>${category.label}</span></a>`
      );

      $trigger.addEventListener("click", (e) => {
        e.preventDefault();
        active_category_id = category_id;
        [...$settingsForm.querySelectorAll(".settings__field")].forEach(
          ($field) => {
            $field.classList.remove("is-hidden");
            if ($field.getAttribute("data-cat") !== active_category_id) {
              $field.classList.add("is-hidden");
            }
          }
        );

        [...$settingsForm.querySelectorAll(".settings__tab-trigger")].forEach(
          ($t) => $t.classList.remove("is-active")
        );
        $trigger.classList.add("is-active");
      });
      
      $settingsForm.querySelector(".settings__tabs nav").appendChild($trigger);
    });

  Object.entries(settings.fields ?? {}).forEach(([field_id, field]) => {
    let $field;
    const opts = { id: field_id, ...field };
    const value = settings[field_id];
    switch (field.type) {
      case "options":
        $field = renderSettingsOptions(field.label, value, opts);
        break;
      case "boolean":
      case "bool":
        $field = renderSettingsSwitch(field.label, value, opts);
        break;
      case "image":
        $field = renderSettingsImage(field.label, value, opts);
        break;
      default:
        $field = renderSettingsText(field.label, value, opts);
        break;
    }

    if (field.category !== active_category_id) {
      $field.classList.add("is-hidden");
    }

    settingsTabsView.appendChild($field);
  });

  $settings.querySelector(".settings__form").addEventListener("submit", (e) => {
    e.preventDefault();
    onSettingsSaveStart();
    onSettingsSave(e);
    onSettingsSaveEnd();
  });

  $settings
    .querySelector(".button.is-cancel")
    .addEventListener("click", (e) => {
      e.preventDefault();
      onSettingsCancel(e);
    });
};
