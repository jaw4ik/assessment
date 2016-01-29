'use strict';

var fs = require('fs');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

module.exports = function parseXml(pathToFile, encoding) {
    if (typeof pathToFile === 'undefined') {
        throw new Error('Define path to xml file');
    }

    encoding = encoding || 'utf16le';

    return new Promise((resolve, reject) => {
        fs.readFile(pathToFile, encoding, (err, data) => {
            if (err) {
                reject(err);
            }
            parser.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    });
}