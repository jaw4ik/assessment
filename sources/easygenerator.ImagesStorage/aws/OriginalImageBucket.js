'use strict';

var S3Client = require('./S3Client');
var config = require('../config');

var _instance = null;

class OriginalImageBucket extends S3Client {
    constructor() {
        if (_instance === null) {
            super(config.awsAccessKeyId, config.awsSecretAccessKey, config.awsOriginalBacketName);
            _instance = this;
        }
        return _instance;
    }
    get url() {
        return `https://${config.awsOriginalBacketName}/`;
    }
}

module.exports = OriginalImageBucket;