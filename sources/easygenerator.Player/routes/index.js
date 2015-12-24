﻿var express = require('express');
var router = express.Router();
var Player = require('../models/player');
var config = require('../config');

router.get('/', function (req, res) {
    var configuration = new Player(req.query);
    res.render('index', {
        video: configuration.video, source: configuration.source, poster: configuration.poster, autoplay: configuration.autoplay,loop: configuration.loop, css: configuration.css, background: configuration.background, controlBar: configuration.controlBar, sourcesUrl: config.sourcesUrl, vimeoFileQualities: JSON.stringify(config.vimeoFileQualities), playerUpdateInterval: config.playerUpdateInterval, volumeKey: config.volumeKey, style_variables: configuration.style_variables
    });
});

module.exports = router;