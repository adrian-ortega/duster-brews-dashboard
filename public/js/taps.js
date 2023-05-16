const resetTapsContainer = () => {
  const $container = getDomContainer();
  let $tapsContainer = $container.querySelector(".taps-edit");
  if ($tapsContainer) {
    $tapsContainer.innerHTML = "";
  } else {
    $tapsContainer = createElementFromTemplate(
      `<div class="taps-edit edit-container container"></div>`
    );
  }
  $container.appendChild($tapsContainer);
  return $tapsContainer;
};

const renderCreateTapForm = () => {
  const $container = resetTapsContainer();
  $container.appendChild(
    createElementFromTemplate(`<div class="settings__container">
      <h2 class="settings__title">Create Tap</h2>
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

  fetch("/api/taps/fields").then(async (response) => {
    const { data } = await response.json();
    Forms.renderFields(data, $container.querySelector(".settings__view"));
  });

  return $container.querySelector(".settings__container");
};

const renderFirstTimeTaps = () => {
  removeWidgetsContainer();
  const $form = renderCreateTapForm();
  const $title = $form.querySelector(".settings__title");
  $title.classList.add("is-first-time");
  $title.innerHTML = "You have no taps!";
  $title.after(
    createElementFromTemplate(`<div class="first-time">
      <p>It looks like you've already added some <strong>Breweries</strong>, GREAT JOB! Now lets add your first <strong>Tap</strong></p>
    </div>`)
  );
  const $cancelBtn = $form.querySelector(".button.is-cancel");
  if ($cancelBtn) {
    $cancelBtn.parentNode.removeChild($cancelBtn);
  }
};

const renderEditTapsForm = () => {};