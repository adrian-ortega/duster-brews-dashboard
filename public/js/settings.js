/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

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
      content: `<input class="input" id="${id}" value="${value}"/>`,
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
  $settings.appendChild(
    createElementFromTemplate('<form method="post"><h2>Settings</h2></form>')
  );
  $container.appendChild($settings);
  return $settings.querySelector("form");
};

const renderSettingsFooter = () => {
  const $footer = createElementFromTemplate(
    '<div class="settings__footer"></div>'
  );
  const $save = createElementFromTemplate(
    '<button class="button is-primary">Save</button>'
  );
  const $cancel = createElementFromTemplate(
    '<button class="button">Cancel</button>'
  );

  $cancel.addEventListener("click", (e) => {
    e.preventDefault();
    fireCustomEvent("ShowWidgets", null, e.target);
  });

  $footer.appendChild($save);
  $footer.appendChild($cancel);
  return $footer;
};

const renderSettings = () => {
  const $settings = renderSettingsReset();
  const state = window[window.APP_NS].state;
  const settings = state.settings ?? {};
  const fields = settings ? settings.fields : [];
  Object.entries(fields).forEach(([field_id, field]) => {
    $settings.appendChild(
      renderSettingsInput(field.label, settings[field_id], {
        id: field_id,
        help: field.help,
      })
    );
  });
  $settings.appendChild(renderSettingsFooter());
};
