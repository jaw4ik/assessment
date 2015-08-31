var 
    app = require('./server'),
    config = require('./config');


if (config.cors) {
    var cors = require('cors')();
    app.use(cors());
    app.options('*', cors());
}

if (config.morgan) {
    var morgan = require('morgan');
    app.use(morgan(config.morgan));
}

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});