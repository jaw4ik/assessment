'use strict';

let sql = require('mssql');

module.exports = {
	connect(config) { 
		return new Promise((resolve, reject) => {
			let connection = new sql.Connection(config, function (err) {
				if (err) {
					reject(err)
					return
				}
				resolve(connection);
			});
		});
	},

	selectQuery(connection, query) {
		return new Promise((resolve, reject) => {
			connection.request().query(query, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	},
	
	updateQuery(connection, query, inputItems, dataArray, iterator) {
		return new Promise((resolve, reject) => {
			let request = new sql.PreparedStatement(connection);
			
			inputItems.forEach(inputItem => request.input(inputItem.key, inputItem.type));

			request.prepare(query, function (err) {
				if (err){
					reject(err);
					return;
				}

				dataArray.forEach(item => request.execute(iterator(item)));
				request.unprepare(function(err) {
					if (err){
						reject(err);
					} else {
						resolve();
					}
				});
			});
		});
	}
}