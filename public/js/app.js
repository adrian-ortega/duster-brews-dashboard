const NOOP = () => {};
const parseJson = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log('Invalid JSON');
    return defaultValue;
  }
}
const createWebSocket = ({ namespace = 'DBDAPP', onopen = NOOP, onmessage = NOOP, onerror = NOOP }) => {
  return new Promise((resolve) => {
    const ws = new WebSocket('ws://localhost:8080/websockets');
    ws.onopen = () => onopen();
    ws.onerror = (error) => onerror(error);
    ws.onmessage = (message) => onmessage(parseJson(message));
    window[namespace].WebSocket = ws;
    resolve(ws);
  });
};
const heartbeat = (timestamp) => {
  if ((timestamp - window[window.APP_NAMESPACE].lastTimestamp) > window[window.APP_NAMESPACE].interval) {
    window[window.APP_NAMESPACE].lastTimestamp = timestamp
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

const createWidgets = async (container, app) => {
  const $container = document.querySelector(container)
  if (!$container) {
    // Display something went wrong message?
    return;
  }

  const items = [ {
    style: 'Lager',
    name: 'Beer One',
    abv: '8.5% ABV',
    status: 'Idle',
    remaining: '48%',
    created_at: '11/11/2022',
    last_pour: '12.2oz'
  } ];

  $container.innerHTML = '';

  app.$widgets = items.map((item) => {
    const $el = createWidgetElement(item);
    $el.dataset.item = item
    $container.appendChild($el);
    return $el;
  });
}

const updateWidgets = (...args) => {
  console.log('UPDATE WIDGETS')
  console.log(args)
}

const initialize = async () => {
  const ns = window.APP_NAMESPACE;
  const app = window[ns];
  await createWebSocket({ namespace: ns, onmessage: updateWidgets });
  await createWidgets('#app', app);
  console.log('app')
  heartbeat();
}

(async () => {
  await initialize();
})();