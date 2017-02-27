'use strict';

var fs = require('fs');
var restler = require('restler');
var _ = require('lodash');

module.exports = {
    postJson: (url, data, authToken) => {
        return new Promise((resolve, reject) => {
            restler.postJson(url, data, {
				accessToken: authToken
            }).on('complete', response => {
                resolve(response);
            });
        });
    },
	postFile: (url, pathToFile, fileType, authToken) => {
		return new Promise((resolve, reject) => {
		    fs.stat(pathToFile, (error, stats) => {
		        if (error) {
		            reject(error);
				}
		        restler.post(url, {
		            multipart: true,
		            accessToken: authToken,
		            data: {
		                'file': restler.file(pathToFile, null, stats.size, null, fileType)
		            }
		        }).on('complete', response => {
		            resolve(response);
		        });
		    });
		});
	}
}