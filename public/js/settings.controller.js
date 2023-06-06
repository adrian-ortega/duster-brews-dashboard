class SettingsController extends RouteController {
  async renderSettings({ app, router }) {
    let { values, fields, categories } = await app.store.dispatch(
      "getSettings"
    );
    let cat = Object.keys(categories || []).shift();

    const $el = this.createElement(SettingsController.FORM_TEMPLATE);
    const $view = $el.querySelector(".settings__view");
    const $triggers = this.createElement(
      `<div class="settings__tabs"><nav>${Object.entries(categories)
        .sort((a, b) => (a.order === b.order ? 0 : a.order > b.order ? -1 : 1))
        .map(([id, c]) => {
          const active = id === cat ? " is-active" : "";
          return `<a href="#" class="button settings__tab-trigger ${active}" data-id="${id}">
            <span class="text">${c.label}</span>
            </a>`;
        })
        .join("")}</nav></div>`
    );
    $el.querySelector(".settings__title").innerHTML = "Settings";
    $el.querySelector(".settings__content").insertBefore($triggers, $view);

    [...$triggers.querySelectorAll(".button")].forEach(($btn) => {
      $btn.addEventListener("click", (e) => {
        cat = $btn.getAttribute("data-id");
        [...$el.querySelectorAll(".settings__form .field")].forEach(
          ($field) => {
            $field.classList.remove("is-hidden");
            if ($field.getAttribute("data-cat") !== cat) {
              $field.classList.add("is-hidden");
            }
          }
        );
        [...$el.querySelectorAll(".settings__tab-trigger")].forEach(($b) =>
          $b.classList.remove("is-active")
        );
        $btn.classList.add("is-active");
        e.preventDefault();
      });
    });

    const fieldAndValues = [...Object.entries(fields)].map(([name, field]) => ({
      name,
      value: values[name],
      ...field,
    }));

    app.Forms.renderFields(
      fieldAndValues,
      $view,
      ($el, { category }) => category !== cat && $el.classList.add("is-hidden")
    );

    $el.querySelector(".button.is-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      router.goTo("home");
    });

    $el
      .querySelector(".settings__form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const response = await fetch("/api/settings", {
          method: "POST",
          body: new FormData($el.querySelector(".settings__form")),
        });
        const { data } = await response.json();
        if (data.updated) {
          fieldAndValues.forEach(({ name, type }) => {
            const value = data.values[name];
            if (type === "image") {
              const $field = $el.querySelector(
                `.input.image-input[data-id="${name}"]`
              );
              [...$field.querySelectorAll(".image-input__file")].map(($f) =>
                $f.classList.add("is-hidden")
              );
              [
                ...$field.querySelectorAll(
                  ".image-input__preview, .button.is-remove"
                ),
              ].map(($f) => $f.classList.remove("is-hidden"));

              $field.querySelector(
                ".image-input__img"
              ).innerHTML = `<img src="${value}" alt="Preview"/>`;
            }

            if (name === "theme") {
              const $root = document.getElementsByTagName("html");
              [...$root[0].classList].forEach((cssClass) => {
                if (cssClass.match(/theme?-(.+)$/gm)) {
                  $root[0].classList.remove(cssClass);
                }
              });
              $root[0].classList.add(`theme-${value}`);
            }
          });

          await app.store.commit("SET_SETTINGS", data.values);
          await app.store.commit("SET_SETTING_FIELDS", data.fields);
          await app.store.commit("SET_SETTING_CATEGORIES", data.categories);
          showNotification("Settings Saved");
        }
        router.goTo("home");
      });

    getDomContainer().appendChild($el);
    return $el;
  }
}
