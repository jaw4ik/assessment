'use strict';

let db = require('./db');
let body = require('../migrationBody');

db.connect(body.config)
	.then(connection => 
		body.migration(connection)
			.then(() => connection.close())
			.catch(reason => {
				console.log(reason);
				connection.close();
			})
	)
	.catch(reason => {
		console.log(reason);
	});