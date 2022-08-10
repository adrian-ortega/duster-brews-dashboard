'use strict';

const { PORT, HOST } = require('./config');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

// Set the view engine to EJS:
// @src https://github.com/mde/ejs
app.set('view engine', 'ejs');

// Middleware
require('./app/router')(app);

// Error Handling
app.use(require('./app/http/middleware/exceptionHandler'));

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);
