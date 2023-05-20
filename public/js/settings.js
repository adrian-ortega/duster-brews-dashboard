class SettingsController extends Templateable {
  renderSettings() {
    const $container = getDomContainer();
    const { state } = getApp();
    let activeId = Object.keys(state.categories)[0];
    const $el = this.render(
      `<div class="container">
  <div class="settings__container">
    <h2 class="settings__title">Settings</h2>
    <form class="settings__form" method="post" action="/">
      <div class="settings__content">
        <div class="settings__tabs">
          <nav>
          ${Object.entries(state.categories)
            .sort((a, b) => a.order - b.order)
            .map(
              ([id, c]) =>
                `<a href="#" class="settings__tab-trigger${
                  id === activeId ? " is-active" : ""
                }" data-id="${id}"><span>${c.label}</span></a>`
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
</div>`,
      $container
    );
    const $form = $el.querySelector(".settings__form");

    [...$el.querySelectorAll(".settings__tab-trigger")].forEach(($trigger) =>
      $trigger.addEventListener("click", (e) => {
        e.preventDefault();
        activeId = $trigger.getAttribute("data-id");

        [...$form.querySelectorAll(".field")].forEach(($field) => {
          $field.classList.remove("is-hidden");
          if ($field.getAttribute("data-cat") !== activeId) {
            $field.classList.add("is-hidden");
          }
        });

        [...$form.querySelectorAll(".settings__tab-trigger")].forEach(($t) =>
          $t.classList.remove("is-active")
        );
        $trigger.classList.add("is-active");
      })
    );

    Forms.renderFields(
      [...Object.entries(state.fields)].map(([name, field]) => ({
        name,
        ...field,
      })),
      $form.querySelector(".settings__view"),
      ($field, field) => {
        if (field.category !== activeId) {
          $field.classList.add("is-hidden");
        }
      }
    );

    return $el;
  }

  async onSubmit(e) {
    const $form = e.target;
    const { state } = getApp();
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
  }

  cancelSubmit() {}
}
