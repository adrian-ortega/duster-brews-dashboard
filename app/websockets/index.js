const Websocket = require('ws');
const {performance} = require('perf_hooks');
const {getWidgetItems} = require('../api');
const {ONE_HOUR, FIFTEEN_MINUTES} = require("../util/time");
const {wait, parseJson} = require("../util/helpers");

let wss;
let widgetHeartbeatId = 0;
let widgetHeartbeatTries = 0;

const widgetHeartbeat = async (timestamp) => {
    clearTimeout(widgetHeartbeatId);
    try {
        const data = await getWidgetItems(timestamp)
        broadcast(data.items);
        widgetHeartbeatTries = 0;
        setTimeout(() => widgetHeartbeat(timestamp + ONE_HOUR), ONE_HOUR);
    } catch (e) {
        if (widgetHeartbeatTries++ < 5) {
            await wait(10);
            return widgetHeartbeat(timestamp + 10)
        }
    }
}

let burnInGuardId = 0;
const burnInGuard = async (timestamp) => {
    try {
        broadcast({burnInGuard: true})
    } catch (e) {}

    clearTimeout(burnInGuardId);
    burnInGuardId = setTimeout(() => burnInGuard(timestamp + FIFTEEN_MINUTES), FIFTEEN_MINUTES)
}

const onConnection = function (ws) {
    const refreshWidgets = () => getWidgetItems().then((items) => ws.send(JSON.stringify({items})));
    
    ws.on('message', (msg) => {
        const data = parseJson(msg);
        if(data.action) {
            switch(data.action) {
                case 'refreshWidgets': refreshWidgets();
            }
        }
    });

    refreshWidgets();
};

const broadcast = (data) => wss.clients.forEach(client => { client.send(JSON.stringify(data)) })

module.exports = (expressServer) => {
    const now = performance.now();
    wss = new Websocket.Server({
        noServer: true,
        path: '/websockets'
    })

    expressServer.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (websocket) => {
            wss.emit('connection', websocket, request);
        });
    });

    wss.on('connection', onConnection);
    
    widgetHeartbeat(now);
    burnInGuard(now);
    return wss
}
