'use strict';

var co = require('co');
var jwt = require('jsonwebtoken');
var config = require('../config');
var ErrorsFactory = require('../models/errors');
var AuthToken = require('../models/AuthToken');

module.exports = (req, res, next) => co(function *() {
    let token = req.headers['authorization'].replace('Bearer ', '');
    try {
        let authToken = new AuthToken(yield jwt.verify(token, new Buffer(config.authSecret, 'base64')));
        req.user = authToken;
    } catch (e) {
        throw ErrorsFactory.unauthorized();
    } 
}).then(next).catch(next);