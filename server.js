'use strict';

const { PORT, HOST } = require('./config')

const express = require('express')
const app = express()

require('./app/router')(app)

app.listen(PORT, HOST)

console.log(`Running on http://${HOST}:${PORT}`);
