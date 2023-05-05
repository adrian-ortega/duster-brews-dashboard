/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const onSettingsSaveStart = () => {
  const $footer = getDomContainer().querySelector(".settings__footer");
  [...$footer.querySelectorAll(".button")].forEach(($button) => {
    $button.classList.add("disabled");
    $button.setAttribute("disabled", true);

    if ($button.classList.contains('is-save')) {
      $button.querySelector('.text').classList.add('is-hidden');
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
  
  formJSONPost('/api/settings', settings);
};

const onSettingsSaveEnd = () => {
  const $footer = getDomContainer().querySelector(".settings__footer");
  [...$footer.querySelectorAll(".button")].forEach(($button) => {
    $button.classList.remove("disabled");
    $button.removeAttribute("disabled");
    if ($button.classList.contains('is-save')) {
      $button.querySelector('.text').classList.remove('is-hidden');
    }
  });
};

const onSettingsCancel = (e) => {
  fireCustomEvent("ShowWidgets", null, e.target);
};

const settingsFieldTemplate = ({ label, id, content = "", help = null }) => {
  return `<div class="settings__field">
        <div class="label">
            <label for="${id}">${label}:</label>
            ${help ? `<p>${help}</p>` : ""}
        </div>
        ${content}
    </div>`;
};

const renderSettingsInput = (label, value, { id = null, help = null }) => {
  return createElementFromTemplate(
    settingsFieldTemplate({
      label,
      id,
      help,
      content: `<input class="input" id="input-${id}" name="${id}" value="${value}"/>`,
    })
  );
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
    $settingsForm.appendChild(
      renderSettingsInput(field.label, settings[field_id], {
        id: field_id,
        help: field.help,
      })
    );
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
