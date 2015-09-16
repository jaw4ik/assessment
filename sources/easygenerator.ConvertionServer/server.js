'use strict';

var 
    express = require('express'),
    config = require('./config'),

    app = express();

if (config.cors) {
    app.use(require('cors')());
}

app.use(config.LOCATION + '/tickets', require('./ticketController'));
app.use(config.LOCATION, require('./fileController.js'));

app.use(function (req, res, next) {
    res.status(404).send('404 Not Found');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;