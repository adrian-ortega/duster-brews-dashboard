/**
 * Walks through every widget item returned and creates a widget
 * DOM Element from it.
 * @param {Array|Array<{}>} items
 * @param {Number} timestamp
 * @return {Promise<void>}
 */
const renderWidgets = async (items, timestamp) => {
    const $container = getDomContainer();
    if (!$container) {
        // Display something went wrong message?
        return;
    }

    $container.innerHTML = '';
    const app = window[window.APP_NS]
    if(!app.widgets.timestamp || ((timestamp - app.widgets.timestamp) > app.widgets.interval)) {
        app.widgets.order = Object.keys(items).map((o,i) => i).sort(() => Math.random() > 0.5 ? 1 : -1);
        app.widgets.timestamp = timestamp
    }

    if(app.widgets.order.length) {
        let tempItems = [];
        for(let i in app.widgets.order) {
            tempItems.push(items[app.widgets.order[i]]);
        }
        items = tempItems;
    }

    window[window.APP_NS].$widgets = items.map((item) => {
        const $el = createWidgetElement(item);
        $container.appendChild($el);
        return $el;
    });
}

/**
 * Callback for the websocket onMessage event
 * @param {Array|Array<{}>} items
 * @param {Number} timestamp
 * @return {Promise<void>}
 */
const updateWidgets = async ({items, timestamp }) => await renderWidgets(items, timestamp || performance.now());

const burnInGuard = () => {
    const $el = document.createElement('div');
    $el.innerHTML = '<div class="burn-in-guard__logo"></div>';
    $el.classList.add('burn-in-guard');
    document.body.appendChild($el);

    setTimeout(() => $el.classList.add('animate'), 100);
    setTimeout(() => $el.parentNode.removeChild($el), 3000);
}

/**
 * Main
 * @return {Promise<void>}
 */
const initialize = async () => {
    window[window.APP_NS].selector = '#app'
    window[window.APP_NS].ws = false

    await createWebSocket({
        onmessage: (data) => {
            if(data.burnInGuard) {
                burnInGuard()
            } else {
                updateWidgets(data)
            }
        }
    });
}

// Go baby go
(async () => {
    await initialize();
})();
