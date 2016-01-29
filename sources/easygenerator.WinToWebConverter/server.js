'use strict';

var express = require('express');
var cors = require('cors');

let app = express();

app.use(cors());

app.use('/', require('./controllers/fileController'));
app.use('/tickets', require('./controllers/ticketController'));

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

app.use((err, req, res, next) => {
    res.status(500).send('Something went wrong!');
});

module.exports = app;