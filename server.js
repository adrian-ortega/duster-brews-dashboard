'use strict';

const { PORT, HOST } = require('./config')

const express = require('express')
const app = express()

// Middleware
require('./app/router')(app)

// Error Handling
app.use(require('./app/http/middleware/exceptionHandler'))

app.listen(PORT, HOST)

console.log(`Running on http://${HOST}:${PORT}`);
