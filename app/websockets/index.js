const Websocket = require('ws');
const queryString = require('query-string');
const { parseJson } = require('../util/helpers')
const { getWidgetItems } = require('../api')

const onConnection = function (websocketConnection, connectionRequest) {
  const [ _path, params ] = connectionRequest?.url?.split('?');
  const connectionParams = queryString.parse(params);

  // NOTE: connectParams are not used here but good to understand how to get
  // to them if you need to pass data with the connection to identify it (e.g., a userId).
  console.log({ _path, connectionParams });

  const sendStatefulResponse = (data) => {
    getWidgetItems().then((items) => {
      websocketConnection.send(JSON.stringify({
        items,
        timestamp: data?.timestamp
      }));
    })
  }

  websocketConnection.on('message', (message) => sendStatefulResponse(parseJson(message)));

  sendStatefulResponse();
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
