/**
 * Creates the main Widget DOM Element that displays the information for
 * each tap.
 * @param {object} item
 * @return {ChildNode}
 */
const createWidgetElement = ({
  id,
  keg,
  style,
  name,
  abv = 0,
  ibu = 0,
  media = [],
  brewery_id,
}) => {
  abv = parseFloat(keg && keg.abv > 0 ? keg.abv : abv).toFixed(1);
  ibu = parseInt(ibu, 10);
  const brewery = getBrewery(brewery_id);
  const keg_percent = parseFloat(keg ? keg.percent_beer_left : "0").toFixed(1);
  const primary_image = media.find((m) => m.primary);
  const brewery_image = brewery.media.find((m) => m.primary);
  const template = `<div id="tap-${id}" class="widget">
    <div class="widget__image">
      ${imgTemplate(primary_image ? primary_image.src : "", name)}
      <div class="widget__image-controls">
        <button class="button is-edit" title="Edit">
          <span class="icon">${ICON_IMAGE_EDIT}</span>
        </button>
      </div>
    </div>
    <div class="widget__content">
      <div class="widget__content-header">
        <div class="keg__image">${imgTemplate(
          brewery_image ? brewery_image.src : "",
          brewery ? brewery.name : ""
        )}</div>
        <div class="keg__header">
          <p class="keg__location">${keg ? keg.keg_location : ""}</p>
          <h2 class="keg__name">${name}</h2>
          <p class="keg__brewery">${brewery ? brewery.name : ""}</p>
        </div>
      </div>
      <div class="widget__content-footer">
        <div class="keg__detail"><h3>${style}</h3></div>
        <div class="keg__detail">
          <p><span class="icon">${ICON_KEG}</span></p>
          <h3>${keg_percent}%</h3>
        </div>
        <div class="keg__detail"><p>ABV</p><h3>${abv}%</h3></div>
        <div class="keg__detail"><p>IBUS</p><h3>${ibu}</h3></div>
        ${
          keg
            ? `<div class="keg__detail"><p>Kegged</p><h3>${keg.keg_date}</h3></div>`
            : ""
        }
      </div>
    </div>
  </div>`;
  $widget = createElementFromTemplate(template);

  const $widget_image = $widget.querySelector(".widget__image");
  const active_css_class = "is-tapped";

  const controlsEscKeyHandler = (e) => {
    if (e.keyCode === 27) closeControls();
  };

  const controlsOutsideClickHandler = (e) => {
    if (!$widget_image.classList.contains("is-tapped")) {
      return false;
    }

    if (e.target !== $widget_image && !$widget_image.contains(e.target)) {
      closeControls();
    }
  };

  const openControls = () => {
    $widget_image.classList.add(active_css_class);
    document.addEventListener("keyup", controlsEscKeyHandler, true);
    document.addEventListener("click", controlsOutsideClickHandler, true);
  };
  const closeControls = () => {
    $widget_image.classList.remove(active_css_class);
    document.removeEventListener("keyup", controlsEscKeyHandler, true);
    document.removeEventListener("click", controlsOutsideClickHandler, true);
  };

  let active_timeout;
  $widget_image.addEventListener("click", (e) => {
    clearTimeout(active_timeout);
    $widget_image.classList.contains(active_css_class)
      ? closeControls()
      : openControls();
  });

  $widget_image.addEventListener("mouseenter", (e) => {
    clearTimeout(active_timeout);
  });

  $widget_image.addEventListener("mouseleave", (e) => {
    if ($widget_image.classList.contains(active_css_class)) {
      active_timeout = setTimeout(closeControls, 3000);
    }
  });

  $widget.querySelector(".button.is-edit").addEventListener("click", (e) => {
    e.preventDefault();
    fireCustomEvent("showImageEditPopup", { id, image_key: "media" }, e.target);
  });

  return $widget;
};

const renderFirstTimeWidgets = () => {
  const $widgetsContainer = getEmptyWidgetsContainer();
  $widgetsContainer.innerHTML = "First Time Widgets";
};

/**
 * Walks through every widget item returned and creates a widget
 * DOM Element from it.
 * @param {Array|Array<{}>} items
 * @param {Number} timestamp
 * @return {Promise<void>}
 */
const renderWidgets = async (items, timestamp) => {
  const app = window[window.APP_NS];
  const $widgetsContainer = getEmptyWidgetsContainer();
  if (
    !app.widgets.timestamp ||
    timestamp - app.widgets.timestamp > app.widgets.interval
  ) {
    app.widgets.order = Object.keys(items)
      .map((o, i) => i)
      .sort(() => (Math.random() > 0.5 ? 1 : -1));
    app.widgets.timestamp = timestamp;
  }

  if (app.widgets.order.length) {
    let tempItems = [];
    for (let i in app.widgets.order) {
      tempItems.push(items[app.widgets.order[i]]);
    }
    items = tempItems;
  }
  window[window.APP_NS].$widgets = items.map((item) => {
    const $el = createWidgetElement(item);
    $widgetsContainer.appendChild($el);
    return $el;
  });
};

const renderImageEditPopup = (e) => {
  const { id } = e.detail;
  const item = getTap(id);
  const image = item.media.find((m) => m.primary);

  const template = `
  <div class="image-edit">
    <div class="image-edit__container">
      <form action="/" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="tap_id" value="${id}"/>
        <div class="image-edit__header">
          <h4>Edit Item Image</h4>
          <button class="button is-close"><span class="icon">${ICON_CLOSE}</span></button>
        </div>
        <div class="image-edit__preview">
          <div class="image-edit__preview-box">${imgTemplate(
            image ? image.src : "",
            "Preview"
          )}</div>
        </div>
        <div class="image-edit__buttons">
          <div class="image-edit__button is-success">
            <label for="widget-image" class="button">
              <input type="file" id="widget-image" name="media" accept="image/*"/>
              <span class="icon is-spinner is-hidden">${ICON_RELOAD}</span>
              <span class="icon">${ICON_UPLOAD}</span>
              <span class="text">Upload</span>
            </label>
          </div>
          <div class="image-edit__button is-danger">
            <button class="button"><span class="icon">${ICON_CLOSE}</span><span class="text">Remove Image</span></button>
          </div>
          <div class="image-edit__button">
            <button class="button is-close"><span class="text">Cancel</span></button>
          </div>
        </div>
      </form>
    </div>
  </div>
  `;

  const $popup = createElementFromTemplate(template);
  const $form = $popup.querySelector("form");

  const onFormSubmit = async (e) => {
    const response = await fetch("/api/taps/media", {
      method: "POST",
      body: new FormData($form),
    });
    const { data } = await response.json();
    if (data.success) {
      const $el = window[window.APP_NS].$widgets.find(
        ($w) => $w.id.replace("tap-", "") === id
      );
      if ($el) {
        $el.querySelector(".widget__image").innerHTML = imgTemplate(
          data.image.src,
          item.name
        );
      }
    }

    const $uploadButton = $form
      .querySelector("#widget-image")
      .closest(".button");
    const $buttonIcons = $uploadButton.querySelectorAll(".icon");
    const $buttonText = $uploadButton.querySelector(".text");
    $buttonText.classList.toggle("is-hidden");
    [...$buttonIcons].forEach(($buttonIcon) => {
      $buttonIcon.classList.toggle("is-hidden");
    });

    if (objectHasMethod(e, "preventDefault")) {
      e.preventDefault();
    }

    fireCustomEvent("ShowTaps");
    setTimeout(() => getDomContainer().removeChild($popup), 1);
  };

  [...$popup.querySelectorAll(".button.is-close")].forEach(($b) =>
    $b.addEventListener("click", (e) => {
      e.preventDefault();
      getDomContainer().removeChild($popup);
    })
  );

  $form.addEventListener("submit", onFormSubmit);

  $popup.querySelector("#widget-image").addEventListener("change", (e) => {
    const $input = e.target;
    const $buttonIcons = $input.closest(".button").querySelectorAll(".icon");
    const $buttonText = $input.closest(".button").querySelector(".text");
    $buttonText.classList.add("is-hidden");
    [...$buttonIcons].forEach(($buttonIcon) => {
      $buttonIcon.classList.toggle("is-hidden");
    });

    onFormSubmit();
  });

  getDomContainer().appendChild($popup);
};

document.addEventListener("showImageEditPopup", renderImageEditPopup);
