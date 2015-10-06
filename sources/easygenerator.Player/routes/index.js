var express = require('express');
var router = express.Router();
var Player = require('../models/player');

router.get('/', function (req, res) {
    var configuration = new Player(req.query);
    res.render('index', { mode: configuration.mode, source: configuration.source, sourceId: configuration.sourceId, poster: configuration.poster, autoplay: configuration.autoplay, css: configuration.css, children: configuration.children });
});

module.exports = router;