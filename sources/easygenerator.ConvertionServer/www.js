var 
    app = require('./server'),
    config = require('./config');


if (config.cors) {
    app.use(require('cors')());
}

if (config.morgan) {
    app.use(require('morgan')(config.morgan));
}

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});