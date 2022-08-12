const NOOP = () => {};
const parseJson = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log('Invalid JSON', str);
    return defaultValue;
  }
}
const createWebSocket = ({ namespace = 'DBDAPP', onmessage = NOOP, onerror = NOOP }) => {
  return new Promise((resolve) => {
    const { port, hostname } = window.location
    const ws = new WebSocket(`ws://${hostname}:${port}/websockets`);
    ws.onopen = () => {
      window[namespace].ws = true
    }
    ws.onerror = (error) => onerror(error);
    ws.onmessage = ({ data }) => onmessage(parseJson(data));

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
const createWidgetElement = (item) => createElementFromTemplate(`
    <div class="widget widget--status">
        <div class="widget__header">
            <span class="beer-style">${item.style}</span>
            <span class="beer-name">${item.name}</span>
            <span class="beer-abv">${item.abv}</span>
            <span class="beer-status">${item.status}</span>
        </div>
        <div class="widget__content">
            <p><strong>Beer Left:</strong> ${item.remaining}</p>
            <p><strong>Keg Tapped Date:</strong> ${item.created_at}<p>
            <p><strong>Las Pour Volume:</strong> ${item.last_pour}</p>
        </div>
    </div>    
`);
const getDomContainer = () => document.querySelector(window[window.APP_NS].selector || '#app');
const renderWidgets = async (items) => {
  const $container = getDomContainer();
  if (!$container) {
    // Display something went wrong message?
    return;
  }

  $container.innerHTML = '';

  window[window.APP_NS].$widgets = items.map((item) => {
    const $el = createWidgetElement(item);
    $el.dataset.item = item
    $container.appendChild($el);
    return $el;
  });
}
const updateWidgets = ({ items }) => {
  renderWidgets(items)
}
const initialize = async () => {
  window[window.APP_NS].selector = '#app'
  window[window.APP_NS].ws = false
  await createWebSocket({ onmessage: updateWidgets });
  heartbeat();
}
(async () => { await initialize(); })();
