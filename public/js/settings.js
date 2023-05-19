class SettingsController extends Templateable {
  renderSettings() {
    const $container = getDomContainer();
    const state = getApp().state;
    const { settings, categories } = state;
    let activeCategory = Object.keys(categories)[0];

    $container.appendChild(
      this.createElement(`<div class="settings__container">
    <h2 class="settings__title">Settings</h2>
    <form class="settings__form" method="post" action="/">
      <div class="settings_content">
        <div class="settings__tabs">
          <nav>
            ${Object.entries(categories)
              .sort((a, b) => a.order - b.order)
              .map(
                ([category_id, category]) =>
                  `<a href="#" class="settings__tab-trigger${
                    category_id === activeCategory ? " is-active" : ""
                  }" data-id="${category_id}"><span>${
                    category.label
                  }</span></a>`
              )
              .join("")}
          </nav>
        </div>
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

    // const $form = $container.querySelector(".settings_content");
    // const $view = $form.querySelector(".settings__view");

    [...$container.querySelectorAll(".settings__tab-trigger")].forEach(($el) =>
      $el.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(e);
        // activeCategory = category_id;
        // [...$settingsForm.querySelectorAll(".field")].forEach(($field) => {
        //   $field.classList.remove("is-hidden");
        //   if ($field.getAttribute("data-cat") !== active_category_id) {
        //     $field.classList.add("is-hidden");
        //   }
        // });

        // [...$settingsForm.querySelectorAll(".settings__tab-trigger")].forEach(
        //   ($t) => $t.classList.remove("is-active")
        // );
        // $trigger.classList.add("is-active");
      })
    );
  }
}

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
  fireCustomEvent("ShowTaps", null, e.target);
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
