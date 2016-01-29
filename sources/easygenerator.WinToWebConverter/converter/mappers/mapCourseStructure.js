'use strict';

var _ = require('lodash');
var EntityFactory = require('../models/EntityFactory');
var Guard = require('../components/Guard');

module.exports = data => {
    Guard.throwIfNotAnObject(data, 'Data (model.xml)');
    Guard.throwIfNotAnObject(data.model, 'Data.model (model.xml)');

    let nodes = [];
    let files = [];

	if (_.isArray(data.model.nodes) && _.isObject(data.model.nodes[0])) {
	    nodes = data.model.nodes[0].node;
	}

	if (_.isArray(data.model.files) && _.isObject(data.model.files[0])) {
		files = data.model.files[0].file;
	}

    return EntityFactory.CourseStructure(nodes, files);
};