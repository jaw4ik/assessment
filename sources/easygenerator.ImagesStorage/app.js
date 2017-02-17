'use strict';

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var indexRoute = require('./routes');
var imageRoute = require('./routes/image');
var imagesRoute = require('./routes/images');

var errorHandler = require('./middlewares/errorHandler');

var DataContext = require('./db');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', indexRoute);
app.use('/image', imageRoute);
app.use('/images', imagesRoute);

app.use(errorHandler);

DataContext.init().then(() => app.listen(process.env.PORT || 222)).catch(reason => {
    throw reason;
});