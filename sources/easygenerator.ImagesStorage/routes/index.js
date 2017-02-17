'use strict';

var express = require('express');
var router = express.Router();
var constants = require('../constants');

router.get('/', (req, res) => {
    res.status(200).send(constants.connected);
});

module.exports = router;