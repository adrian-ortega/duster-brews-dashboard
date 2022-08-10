'use strict';

const { PORT, HOST } = require('./config');
const websockets = require('./app/websockets')

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

const server = app.listen(PORT, () => {
    console.log(`Server Running at http://${HOST}:${PORT}`)
});

websockets(server)

process.on('message', message => {
    console.log('process message', message)
})