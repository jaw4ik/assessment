'use strict';

let sql = require('mssql');

let that = {
	db: null
};

module.exports = {
	connect: conn => new Promise((resolve, reject) => {
		var connection = new sql.Connection(conn, function (err, db) {
			if (err) {
				reject(err)
				return
			}
			resolve(connection);
		})

	})
}