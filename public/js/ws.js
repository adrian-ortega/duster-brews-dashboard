/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * Created the app instance of WebSocket and attaches it to
 * the global instance. passes the message and error functions
 * to the passed callaback params
 * @param {string} namespace
 * @param {function} onmessage
 * @param {function} onerror
 * @return {Promise<WebSocket>}
 */
const createWebSocket = ({namespace = 'DBDAPP', onmessage = NOOP, onerror = NOOP}) => {
    return new Promise((resolve) => {
        const {port, hostname} = window.location;
        const ws = new WebSocket(`ws://${hostname}:${port}/websockets`);
        ws.onopen = () => {
            window[namespace].ws = true;
        }
        ws.onerror = (error) => onerror(error);
        ws.onmessage = ({data}) => onmessage(parseJson(data));

        window[namespace].WebSocket = ws;
        window[namespace].fireAction = (action, data = null) => ws.send(JSON.stringify({ action, data }));
        resolve(ws);
    });
};
