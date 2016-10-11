var request = require('request-promise');
var express = require('express');
var config = require('../config');
var nocache = require('../middlewares/nocache');
var router = express.Router();

router.get('/', nocache, function (req, res) {
    var mediaId = req.query && req.query.mediaId;
    if (!mediaId) {
        res.status(400).send('mediaId is required');
        return;
    }
    request({
        method: 'GET',
        uri: config.sourcesUrl + mediaId + '/config',
        json: true
    }).then(function (data) {
        var files = [];
        if (data && data.request && data.request.files && data.request.files.progressive) {
            files = data.request.files.progressive;
        }
        var sources = [];
        for (var i = 0; i < files.length; i++) {
            if (!files[i] || !files[i].url || !files[i].quality) {
                continue;
            }
            sources.push({ url: files[i].url, quality: files[i].quality });
        }
        res.json(sources);
    }).catch(function (reason) {
        if (reason) {
            if (reason.statusCode === 404) {
                res.status(404).send(reason.error ? reason.error.message : 'media does not exist');
                return;
            }
            if (reason.statusCode === 500) {
                res.status(500).send(reason.error ? reason.error.message : 'media is not processed yet');
                return;
            }
        }
        res.status(500).send('an error has been occurred');
    });
});

module.exports = router;