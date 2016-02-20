'use strict';

var _ = require('lodash');

class Guard{
    static throwIfNotAnObject(obj, name) {
        if (!_.isObject(obj)) {
            throw `${name} is not an object`;
        }
    }
	static throwIfNotAnArray(arr, name) {
	    if (!_.isArray(arr)) {
	        throw `${name} is not an array`;
	    }
	}
}

module.exports = Guard;