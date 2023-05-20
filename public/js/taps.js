class TapsController extends Templateable {
  getTap(id) {
    return window[window.APP_NS].state.taps.find((t) => t.id === id);
  }

  renderList({ app }) {
    const $container = getDomContainer();
    const { taps } = app.state;
    const filteredTaps = taps
      .filter((tap) => tap.active)
      .map((tap) => {
        const image = tap.media.find((m) => m.primary);
        const brewery = getBrewery(tap.brewery_id);
        const bImage = brewery.media.find((m) => m.primary);
        return {
          name: tap.name,
          style: tap.style,
          brewery,
          ibu: tap.ibu,
          abv: tap.abv,
          image: {
            src: image ? image.src : null,
            alt: tap.name,
          },
          brewery_image: {
            src: bImage ? bImage.src : null,
            alt: brewery.name,
          },
        };
      });

    const tapTemplate = (tap) => {
      const tapImage = tap.image.src
        ? `<figure><span><img src="${tap.image.src}" alt="${tap.image.alt}"/></span></figure>`
        : "";
      const breweryImage = tap.brewery_image.src
        ? `<figure><span><img src="${tap.brewery_image.src}" alt="${tap.brewery_image.alt}"/></span></figure>`
        : "";
      return `
        <div class="tap">
          <div class="tap__image">${tapImage}</div>
          <div class="tap__content">
            <div class="tap__content-header">
              <div class="keg__image">${breweryImage}</div>
              <div class="keg__header">
                <p class="keg__location">KEG LOCATION</p>
                <h2 class="keg__name">${tap.name}</h2>
                <p class="keg__brewery">${tap.brewery.name}</p>
              </div>
            </div>
            <div class="tap__content-footer">
              <div class="keg__detail"><h3>${tap.style}</h3></div>
              <div class="keg__detail">
                <p><span class="icon">${ICON_KEG}</span></p>
                <h3>0.0%</h3>
              </div>
              <div class="keg__detail"><p>ABV</p><h3>${tap.abv}%</h3></div>
              <div class="keg__detail"><p>IBUS</p><h3>${tap.ibu}</h3></div>
              <div class="keg__detail"><p>Kegged</p><h3>KEG DATE</h3></div>
            </div>
          </div>
        </div>
      `;
    };

    const $el = this.createElement(
      `<div class="taps">${
        filteredTaps.length ? filteredTaps.map(tapTemplate) : "None"
      }</div>`
    );

    $container.appendChild($el);
    return $el;
  }

  renderFirstTime() {}

  renderCreateForm() {}

  renderEditForm() {}
}

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
            <button type="submit" class="button is-save-plus is-primary">
              <span class="icon is-spinner is-hidden">${ICON_RELOAD}</span>
              <span class="text">Save + Another</span>
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

  $container
    .querySelector(".settings__form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      fetch("/api/taps", {
        method: "POST",
        body: new FormData(e.target),
      }).then((response) =>
        response.json().then(({ data, meta }) => {
          if (data.status === 422) {
            // @TODO validation failed
          } else {
            if (meta && meta.status) {
              showNotification(
                meta.status === "created" ? "New tap created" : "Tap updated"
              );
            }

            console.log({ data, meta });

            if (e.submitter && e.submitter.classList.contains("is-save-plus")) {
              fireCustomEvent("AddTap");
            } else {
              fireCustomEvent("ShowTaps");
            }
          }
        })
      );
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
