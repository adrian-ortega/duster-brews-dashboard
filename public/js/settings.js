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
  const fields = state.fields ?? {};
  Object.entries(fields).forEach(([field_id, field]) => {
    const $input = $form[field_id];
    settings[field_id] = $input.value;
  });

  const response = await fetch("/api/settings", {
    method: "POST",
    body: new FormData($form),
  });
  const { data } = await response.json();

  console.log("Settings Saved", data);
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

const renderSettingsReset = () => {
  const $container = getDomContainer();
  let $settings = $container.querySelector(".settings");
  if ($settings) {
    $settings.innerHTML = "";
  } else {
    $settings = createElementFromTemplate(
      `<div class="settings edit-container container"></div>`
    );
  }
  $container.appendChild($settings);
  return $settings;
};

const renderSettings = () => {
  const $settings = renderSettingsReset();
  const state = window[window.APP_NS].state;
  const settings = state.settings ?? {};
  const categories = state.categories ?? {};
  let active_category_id = Object.keys(categories)[0];

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
        [...$settingsForm.querySelectorAll(".field")].forEach(
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

  Object.entries(state.fields ?? {}).forEach(([field_id, field]) => {
    let $field;
    const opts = { id: field_id, ...field };
    const value = settings[field_id] ?? null;
    switch (field.type) {
      case "options":
        $field = Forms.renderSelectField(field.label, value, opts);
        break;
      case "boolean":
      case "bool":
        $field = Forms.renderSwitchField(field.label, value, opts);
        break;
      case "image":
        $field = Forms.renderImageField(field.label, value, opts);
        break;
      default:
        $field = Forms.renderTextField(field.label, value, opts);
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
