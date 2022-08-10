const Websocket = require('ws');
const queryString = require('query-string')

const onConnection = function (websocketConnection, connectionRequest) {
    const [_path, params] = connectionRequest?.url?.split('?');
    const connectionParams = queryString.parse(params);

    // NOTE: connectParams are not used here but good to understand how to get
    // to them if you need to pass data with the connection to identify it (e.g., a userId).
    console.log({ connectionParams });

    websocketConnection.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        console.log({ parsedMessage });
    });
};

module.exports = (expressServer) => {
    const webSocketServer = new Websocket.Server({
        noServer: true,
        path: '/websockets'
    })

    expressServer.on('upgrade', (request, socket, head) => {
        webSocketServer.handleUpgrade(request, socket, head, (websocket) => {
            webSocketServer.emit('connection', websocket, request);
        });
    });

    webSocketServer.on('connection', onConnection)

    return webSocketServer
}