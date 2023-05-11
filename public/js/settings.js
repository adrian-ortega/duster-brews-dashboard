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

const onSettingsSave = (e) => {
  const $form = e.target;
  const state = window[window.APP_NS].state;
  const settings = state.settings ?? {};
  const fields = settings.fields ?? {};
  Object.entries(fields).forEach(([field_id, field]) => {
    const $input = $form[field_id];
    settings[field_id] = $input.value;
  });

  formJSONPost("/api/settings", settings);
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
  fireCustomEvent("ShowWidgets", null, e.target);
};

const settingsFieldTemplate = ({ label, id, content = "", help = null }) => {
  const $field = createElementFromTemplate(`
    <div class="settings__field">
      <div class="label"><label for="input-${id}">${label}:</label>
      ${help ? `<p>${help}</p>` : ""}
      </div>
    </div>
  `);

  $field.appendChild(
    content instanceof Element
      ? content
      : createElementFromTemplate(content)
  );

  return $field;
};

const renderSettingsInput = (label, value, { id = null, help = null }) => {
  return settingsFieldTemplate({
    label,
    id,
    help,
    content: `<input class="input" id="input-${id}" name="${id}" value="${value}"/>`,
  });
};

const renderSettingsOptions = (label, value, { id, help, options = [] }) => {
  const transformer = (option) => {
    const oText = isObject(option) ? option.text : option;
    const oValue = isObject(option) ? option.value : option;
    const oSel = oValue === value ? ' selected="selected"' : '';
    return `<option value="${oValue}"${oSel}>${oText}</option>`;
  }
  const $content = createElementFromTemplate(`<select id="input-${id}" name="${id}">${options.map(transformer)}</select>`);
  return settingsFieldTemplate({ label, id, help, content: $content })
};

const renderSettingsImage = (label, value, { id, help }) => {
  const $content = createElementFromTemplate(
    `<label for="input-${id}">
      <input type="file" id="input-${id}" name="${id}"/>
      <span></span>
    </label>`
  );
  return settingsFieldTemplate({ label, id, help, content: $content })
};
const renderSettingsSwitch = (label, value, { id, help }) => {
  const checked = value ? 'checked="checked"' : "";
  const content = `<label for="input-${id}" class="checkbox"><input type="checkbox" id="input-${id}" name="${id}" value="1" ${checked}><span></span></span>`;
  return settingsFieldTemplate({ label, id, help, content });
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
  const fields = settings.fields ?? {};

  $settings.appendChild(
    createElementFromTemplate(`
    <div class="settings__container">
      <h2 class="settings__title">Settings</h2>
      <form class="settings__form" method="post" action="/">
        <div class="settings_content"></div>
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

  Object.entries(fields).forEach(([field_id, field]) => {
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
      case null:
      default:
        $field = renderSettingsInput(field.label, value, opts);
        break;
    }
    $settingsForm.appendChild($field);
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
