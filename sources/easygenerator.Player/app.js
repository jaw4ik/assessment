var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var index = require('./routes/index');
var cors = require('cors');
var app = express();

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));

if (app.get('env') === 'development') {
    var logger = require('morgan');
    app.use(logger('dev'));
    app.use(require('less-middleware')(path.join(__dirname, 'public')));
}

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: 'Something went wrong!',
        error: {}
    });
});


module.exports = app;
