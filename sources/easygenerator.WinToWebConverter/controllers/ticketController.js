'use strict';

var express = require('express');
var config = require('../config');
var ticketDispatcher = require('../components/ticketDispatcher');

var router = express.Router();
var applications = config.API_KEY;

router.use((req, res, next) => {
	let token = req.get('authorization') && req.get('authorization').split(' ')[1];
	if (token && (applications.indexOf(token) > -1)) {
        next();
    } else {
        res.status(401).send('401 Unauthorized');
    }
});

router.post('/', (req, res) => {
    res.status(200).send(ticketDispatcher.create());
});

module.exports = router;