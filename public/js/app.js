const TRANSPARENT_PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
const NOOP = () => {
};
const parseJson = (str, defaultValue = null) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.log('Invalid JSON', str);
        return defaultValue;
    }
}
const createWebSocket = ({namespace = 'DBDAPP', onmessage = NOOP, onerror = NOOP}) => {
    return new Promise((resolve) => {
        const {port, hostname} = window.location
        const ws = new WebSocket(`ws://${hostname}:${port}/websockets`);
        ws.onopen = () => {
            window[namespace].ws = true
        }
        ws.onerror = (error) => onerror(error);
        ws.onmessage = ({data}) => onmessage(parseJson(data));

        window[namespace].WebSocket = ws;
        resolve(ws);
    });
};
const heartbeat = (timestamp) => {
    const ns = window.APP_NS
    const app = window[ns]
    if ((timestamp - app.lastTimestamp) > app.interval) {
        if (app.ws) {
            app.WebSocket.send(JSON.stringify({timestamp}))
        }
        app.lastTimestamp = timestamp
        return;
    }
    window.requestAnimationFrame(heartbeat)
}
const createElementFromTemplate = (template) => {
    const _div = document.createElement('div')
    _div.innerHTML = template.trim()
    return _div.firstChild
}
const imgTemplate = (src, alt = '') => {
    return `<figure><img src="${src}" alt="${alt}"/></figure>`
}
const createWidgetElement = (item) => createElementFromTemplate(`
<div class="widget widget--beer">
  <div class="widget__header">
    <div class="beer-name"><div>${item.name}</div></div>
    <div class="thermometer">
      <div class="thermometer__bar">
        <span class="thermometer__value">2.48%</span>
      </div>
    </div>
  </div>
  <div class="widget__label">
  ${item.background_image
    ? imgTemplate(item.background_image, item.name)
    : imgTemplate(TRANSPARENT_PLACEHOLDER_IMAGE, 'No Beer Label')
  }
    <div class="beer-brewery">${imgTemplate(TRANSPARENT_PLACEHOLDER_IMAGE, 'No Brewery Icon')}</div>         
  </div>
  <div class="widget__footer">
    <p class="beer-style">${item.style}</p>
    ${item.keg ? ` <p class="beer-abv">${item.keg.abv}</p><p class="beer-created">${item.keg.keg_date}</p>` : ''}
  </div>
</div>`);

const getDomContainer = () => document.querySelector(window[window.APP_NS].selector || '#app');
const renderWidgets = async (items) => {
    const $container = getDomContainer();
    if (!$container) {
        // Display something went wrong message?
        return;
    }

    $container.innerHTML = '';

    window[window.APP_NS].$widgets = items.map((item) => {
        console.log(item)
        const $el = createWidgetElement(item);
        $el.dataset.item = JSON.stringify(item);
        $container.appendChild($el);
        return $el;
    });
}
const updateWidgets = ({items}) => {
    renderWidgets(items)
}
const initialize = async () => {
    window[window.APP_NS].selector = '#app'
    window[window.APP_NS].ws = false
    await createWebSocket({onmessage: updateWidgets});
    heartbeat();
}
(async () => {
    await initialize();
})();
