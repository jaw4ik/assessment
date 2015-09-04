'use strict';

var 
    express = require('express'),
    router = express.Router();

var 
    ticketDispatcher = require('./ticketDispatcher'),

    config = require('./config'),
    applications = config.applications;

router.use(function(req, res, next) {
    var token = req.get('authorization') && req.get('authorization').split(' ')[1];
    if (token && (applications.indexOf(token) > -1)) {
        next();
    } else {
        res.status(401).send('401 Unauthorized');
    }
});

router.post('/', function(req, res) {
    res.status(200).send(ticketDispatcher.create());
});

module.exports = router;