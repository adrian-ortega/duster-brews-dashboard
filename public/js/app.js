/* eslint-disable no-undef */

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
    window[window.APP_NS].selector = '#app';
    window[window.APP_NS].ws = false;

    const $container = getDomContainer();
    if($container) $container.innerHTML = '';

    initializeNav();
    renderPlaceholders();
    await createWebSocket({
        onmessage: (data) => {
            if(objectHasKey(data, 'burnInGuard')) {
                return burnInGuard();
            }
            if(window[APP_NS].route === 'home') {
                updateWidgets(data);
            }
        }
    });
}

// Go baby go
(async () => {
    await initialize();
    document.addEventListener('ShowSettings', () => {
        renderSettings();
        window[APP_NS].route = 'settings';
        document.querySelector('.nav-buttons').classList.add('is-hidden');
    });
    
    document.addEventListener('ShowWidgets', () => {
        renderPlaceholders();
        window[window.APP_NS].route = 'home';
        window[window.APP_NS].fireAction('refreshWidgets');
        document.querySelector('.nav-buttons').classList.remove('is-hidden');
      })
})();
