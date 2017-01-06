'use strict';

let db = require('./db');
let sql = require('mssql');
let body = require('./../migrationBody');
let co = require('co');

db.connect(body.config)
	.then((connection) => {
		return co(function* () {
			let array = yield getArray(connection);
			let currentItem = 0,
				amount = array.length;
			let request = new sql.PreparedStatement(connection);
			request.input('settings', sql.NVARCHAR);
            request.input('extraData', sql.NVARCHAR);
			request.input('id', sql.UNIQUEIDENTIFIER);
			request.prepare('update CourseTemplateSettings set Settings = @settings, Extradata = @extradata where Id = @id', function (err) {
				if (err){
					console.log(err);
					return;
				}
				while (currentItem < amount) {
					console.log(currentItem + 1 + '/' + amount);
					let newSettings = body.migrationFunction(JSON.parse(array[currentItem].Settings),JSON.parse(array[currentItem].ExtraData));
					save(array[currentItem].Id, request, newSettings);
					currentItem++;
				}
			})
		});
	}).catch(reason => {
		console.log(reason);
	})


function save(item, request, arr) {

	return new Promise((resolve, reject) => {
        
		request.execute({ settings: arr[0], extraData: arr[1] , id: item }, function (err) {
			if (err) {
				reject(err);
				return
			}
			resolve();
		});

	})

}


function getArray(connection) {
	return new Promise((resolve, reject) => {
		let query = 'select * from CourseTemplateSettings';
		if (body.column) {
			query += ' where ' + body.column + ' = ';
			if (body.value) {
				query += '\'' + body.value + '\''
			}
		}

		let request = connection.request();
		request.query(query, function (err, data) {
			if (err) {
				reject(err);
				return;
			}
			resolve(data);
		});
	});
} 

