"use strict";

const { PORT, HOST } = require("./config");
const path = require("path");
const websockets = require("./app/websockets");
const es6Renderer = require("express-es6-template-engine");

const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "/public")));

app.engine("html", es6Renderer);
app.set("views", "views");
app.set("view engine", "html");

// Middleware
require("./app/router")(app);

// Error Handling
app.use(require("./app/http/middleware/exceptionHandler"));

const server = app.listen(PORT, () => {
  console.clear();
  console.log(`Server Running at http://${HOST}:${PORT}`);
});

websockets(server);
