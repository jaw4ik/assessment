﻿var app = require('./app');
app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});