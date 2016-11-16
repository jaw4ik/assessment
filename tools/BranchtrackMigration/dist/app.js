'use strict';

let db = require('./db');
let body = require('../migrationBody');

db.connect(body.config)
	.then(body.migration)
	.catch(reason => {
		console.log(reason);
	});