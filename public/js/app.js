const TRANSPARENT_PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
const BEER_BAR_SECTIONS = (new Array(8)).fill(0).map((v, i) => (((i+1)/8) * 100));

const NOOP = () => {};
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
    const app = window[window.APP_NS]
    if ((timestamp - app.lastTimestamp) > app.updateInterval) {
        if (app.ws) {
            app.WebSocket.send(JSON.stringify({timestamp}))
        }
        app.lastTimestamp = timestamp
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
const createWidgetElement = (item) => {
    const beer_left_percent = item.keg ? parseFloat(item.keg.percent_beer_left) : 0
    const beer_bar_current_section = BEER_BAR_SECTIONS.reduce((currSec, curr, i, sections) => {
        const previous = sections[i - 1] ? sections[i - 1] : 0;
        if (beer_left_percent >= previous && beer_left_percent <= curr) {
            currSec = i;
        }
        return currSec
    }, 0);
    console.log({item, section: beer_bar_current_section, sections: BEER_BAR_SECTIONS})
    return createElementFromTemplate(`
<div class="widget widget--beer">
  <div class="widget__header">
    <div class="beer-name"><div>${item.name}</div></div>
    <div class="thermometer">
      <div class="thermometer__bar" style="height: ${beer_left_percent}%" data-section="${beer_bar_current_section}">
        <span class="thermometer__value">${beer_left_percent}%</span>
      </div>
    </div>
  </div>
  <div class="widget__label"${item.background_image ? ` style="background-image: url(${item.background_image});` : ''}">
    <div class="beer-brewery">${imgTemplate(TRANSPARENT_PLACEHOLDER_IMAGE, 'No Brewery Icon')}</div>
  </div>
  <div class="widget__footer">
    <p class="beer-style">${item.style}</p>
    ${item.keg ? ` <p class="beer-abv">${item.keg.abv}</p><p class="beer-created">${item.keg.keg_date}</p>` : '<p class="beer-no-keg">No Keg Info</p>'}
  </div>
  <div class="widget__indicators">
    <div class="indicator indicator--pour">
      <div class="indicator__led"${item.pour ? ' data-active' :  ''}><span></span></div>
      <div class="span indicator__label">Pour</div>
    </div>
    <div class="indicator indicator--leak">
      <div class="indicator__led"><span></span></div>
      <div class="span indicator__label">Leak</div>
    </div>  
  </div>
</div>`)
};
const getDomContainer = () => document.querySelector(window[window.APP_NS].selector || '#app');

let widgetOrder = [];
let widgetOrderTimestamp;
let widgetOrderInterval = 300000;
const renderWidgets = async (items, timestamp) => {
    const $container = getDomContainer();
    if (!$container) {
        // Display something went wrong message?
        return;
    }

    $container.innerHTML = '';
    if(!widgetOrderTimestamp || ((timestamp - widgetOrderTimestamp) > widgetOrderInterval)) {
        widgetOrder = Object.keys(items).map((o,i) => i).sort(() => Math.random() > 0.5 ? 1 : -1);
        widgetOrderTimestamp = timestamp
    }

    if(widgetOrder.length) {
        let tempItems = [];
        for(let i in widgetOrder) {
            tempItems.push(items[widgetOrder[i]]);
        }
        items = tempItems;
    }

    window[window.APP_NS].$widgets = items.map((item) => {
        const $el = createWidgetElement(item);
        $el.dataset.item = JSON.stringify(item);
        $container.appendChild($el);
        return $el;
    });
}
const updateWidgets = async ({items, timestamp }) => await renderWidgets(items, timestamp || performance.now())
const initialize = async () => {
    window[window.APP_NS].selector = '#app'
    window[window.APP_NS].ws = false
    await createWebSocket({onmessage: updateWidgets});
    heartbeat();
}
(async () => {
    await initialize();
})();
