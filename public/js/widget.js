/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const showWidgetEditPopup = (id) => {
  alert(id);
}

/**
 * Creates an element as a placeholder for loading widgets
 * @param {Number} i 
 * @returns {ChildNode}
 */
const createWidgetPlaceholder = (i) => {
  const template = `<div id="keg-P${i}" class="widget is-placeholder">
    <div class="widget__image"><span class="placeholder is-image"></span></div>
    <div class="widget__content">
      <div class="widget__content-header">
        <div class="keg__image"><span class="placeholder is-image"></span></div>
        <div class="keg__header">
          <p class="keg__location"><span class="placeholder is-small"></span></p>
          <h2 class="keg__name"><span class="placeholder is-tiny"></span><span class="placeholder is-med"></span></h2>
          <p class="keg__brewery"><span class="placeholder is-tiny"></span><span class="placeholder is-small"></span></p>
        </div>
      </div>
      <div class="widget__content-footer">
        <div class="keg__detail"><h3><span class="placeholder is-tiny"></span></h3></div>
        <div class="keg__detail">
          <p><span class="placeholder is-icon"></span></p>
          <h3><span class="placeholder is-tiny"></span></h3>
        </div>
        <div class="keg__detail"><p><span class="placeholder is-tiny"></span></p><h3><span class="placeholder is-tiny"></span></h3></div>
        <div class="keg__detail"><p><span class="placeholder is-tiny"></span></p><h3><span class="placeholder is-tiny"></span></h3></div>
        <div class="keg__detail"><p><span class="placeholder is-small"></span></p><h3><span class="placeholder is-small"></span></h3></div>
      </div>
    </div>
  </div>`;

  return createElementFromTemplate(template);
};

/**
 * Creates the main Widget DOM Element that displays the information for
 * each beer.
 * @param {object} item
 * @return {ChildNode}
 */
const createWidgetElement = ({ id, keg, brewery, brewery_image, style, name, background_image, abv, ibu }) => {
  abv = parseFloat(keg.abv > 0 ? keg.abv : abv).toFixed(1);
  ibu = parseInt(ibu, 10)
  const keg_percent = parseFloat(keg.percent_beer_left).toFixed(1);
  const template = `<div id="keg-${keg.id}" class="widget">
    <div class="widget__image">
      ${imgTemplate(background_image, name)}
      <div class="widget__image-controls">
        <button class="button is-edit" title="Edit">
          <span class="icon">${ICON_IMAGE_EDIT}</span>
        </button>
      </div>
    </div>
    <div class="widget__content">
      <div class="widget__content-header">
        <div class="keg__image">${imgTemplate(brewery_image, brewery)}</div>
        <div class="keg__header">
          <p class="keg__location">${keg.keg_location}</p>
          <h2 class="keg__name">${name}</h2>
          <p class="keg__brewery">${brewery}</p>
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
        <div class="keg__detail"><p>Kegged</p><h3>${keg.keg_date}</h3></div>
      </div>
    </div>
  </div>`;
  $widget = createElementFromTemplate(template);

  const $widget_image = $widget.querySelector('.widget__image');
  const active_css_class = 'is-tapped';

  const controlsEscKeyHandler = (e) => {
    if (e.keyCode === 27) closeControls();
  };

  const controlsOutsideClickHandler = (e) => {
    if(!$widget_image.classList.contains('is-tapped')) {
      return false;
    }

    if(e.target !== $widget_image && !$widget_image.contains(e.target)) {
      closeControls();
    }
  };

  const openControls = () => {
    $widget_image.classList.add(active_css_class);
      document.addEventListener('keyup', controlsEscKeyHandler, true);
      document.addEventListener('click', controlsOutsideClickHandler, true);
  }
  const closeControls = () => {
    $widget_image.classList.remove(active_css_class);
    document.removeEventListener('keyup', controlsEscKeyHandler, true);
    document.removeEventListener('click', controlsOutsideClickHandler, true);
  }

  let active_timeout;
  $widget_image.addEventListener('click', (e) => {
    clearTimeout(active_timeout);
    $widget_image.classList.contains(active_css_class) ? closeControls() : openControls();
  });

  $widget_image.addEventListener('mouseenter', (e) => {
    clearTimeout(active_timeout);
  });

  $widget_image.addEventListener('mouseleave', (e) => {
    if ($widget_image.classList.contains(active_css_class)) {
      active_timeout = setTimeout(closeControls, 3000);
    }
  });

  $widget.querySelector('.button.is-edit').addEventListener('click', (e) => {
    e.preventDefault();
    showWidgetEditPopup(id);
  });

  return $widget;
};

/**
 * Creates five placeholder widgets while the websocket connects and returns a message.
 * @return {Promise<void>}
 */
const renderPlaceholders = async () => {
  const $widgetsContainer = getWidgetContainer();
  $widgetsContainer.innerHTML = '';

  window[window.APP_NS].$widgets = (new Array(5)).fill(0).map((_, i) => {
    const $el = createWidgetPlaceholder(i);
    $widgetsContainer.appendChild($el);
    return $el;
  });
};

/**
* Walks through every widget item returned and creates a widget
* DOM Element from it.
* @param {Array|Array<{}>} items
* @param {Number} timestamp
* @return {Promise<void>}
*/
const renderWidgets = async (items, timestamp) => {
  const app = window[window.APP_NS]
  const $widgetsContainer = getWidgetContainer();

  if (!app.widgets.timestamp || ((timestamp - app.widgets.timestamp) > app.widgets.interval)) {
    app.widgets.order = Object.keys(items).map((o, i) => i).sort(() => Math.random() > 0.5 ? 1 : -1);
    app.widgets.timestamp = timestamp
  }

  if (app.widgets.order.length) {
    let tempItems = [];
    for (let i in app.widgets.order) {
      tempItems.push(items[app.widgets.order[i]]);
    }
    items = tempItems;
  }

  $widgetsContainer.innerHTML = '';

  window[window.APP_NS].$widgets = items.map((item) => {
    const $el = createWidgetElement(item);
    $widgetsContainer.appendChild($el);
    return $el;
  });
};