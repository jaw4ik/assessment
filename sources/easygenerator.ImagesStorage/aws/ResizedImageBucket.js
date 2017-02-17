'use strict';

var S3Client = require('./S3Client');
var config = require('../config');

var _instance = null;

class ResizedImageBucket extends S3Client {
    constructor() {
        if (_instance === null) {
            super(config.awsAccessKeyId, config.awsSecretAccessKey, config.awsResizedBucketName);
            _instance = this;
        }
        return _instance;
    }
    get url() {
        return `${config.awsUrl}${config.awsResizedBucketName}/`;
    }
}

module.exports = ResizedImageBucket;