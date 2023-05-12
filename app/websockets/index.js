const Websocket = require("ws");
const Settings = require("../settings");
const { performance } = require("perf_hooks");
const Items = require("../models/Items");
const { ONE_SECOND } = require("../util/time");
const { wait, parseJson } = require("../util/helpers");

let wss;
let widgetHeartbeatId = 0;
let widgetHeartbeatTries = 0;

const widgetHeartbeat = async (timestamp) => {
  clearTimeout(widgetHeartbeatId);
  try {
    const timeOffset =
      parseInt(Settings.get("refresh_rate", "60"), 10) * ONE_SECOND;
    const data = await Items.all();
    broadcast(data.items);
    widgetHeartbeatTries = 0;
    setTimeout(() => widgetHeartbeat(timestamp + timeOffset), timeOffset);
  } catch (e) {
    if (widgetHeartbeatTries++ < 5) {
      await wait(10);
      return widgetHeartbeat(timestamp + 10);
    }
  }
};

let burnInGuardId = 0;
const burnInGuard = async (timestamp) => {
  try {
    broadcast({ burnInGuard: true });
  } catch (e) {
    // Does nothing, no need to log this at all.
  }

  clearTimeout(burnInGuardId);
  const timeOffset =
    parseInt(Settings.get("burn_in_guard_refresh_rate", "15"), 10) * ONE_SECOND;
  burnInGuardId = setTimeout(
    () => burnInGuard(timestamp + timeOffset),
    timeOffset
  );
};

const onConnectionMessage = async (data, ws) => {
  if (data.action) {
    const response = {};
    switch (data.action) {
      case "refreshWidgets":
        response.items = await Items.all();
        break;
      case "refreshSettings":
        response.settings = Settings.all();
        break;
    }
    ws.send(JSON.stringify(response));
  }
};

const onConnection = async function (ws) {
  ws.on("message", (msg) => onConnectionMessage(parseJson(msg), ws));
  ws.send(
    JSON.stringify({
      items: await Items.all(),
      settings: Settings.all(),
    })
  );
};

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });

module.exports = (expressServer) => {
  const now = performance.now();
  wss = new Websocket.Server({
    noServer: true,
    path: "/websockets",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit("connection", websocket, request);
    });
  });

  wss.on("connection", onConnection);

  widgetHeartbeat(now);
  burnInGuard(now);
  return wss;
};
