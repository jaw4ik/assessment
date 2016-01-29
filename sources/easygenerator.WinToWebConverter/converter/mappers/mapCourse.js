'use strict';

var _ = require('lodash');
var EntityFactory = require('../models/EntityFactory');
var Guard = require('../components/Guard');
var mapContent = require('./questions/mapContent');

module.exports = (courseData, wcicData, imagesStorage)=> {
	Guard.throwIfNotAnObject(courseData, 'courseData (course)');
    Guard.throwIfNotAnObject(courseData.CourseDetails, 'courseData.CourseDetails (course)');

    let courseDetails = courseData.CourseDetails.Node[0];
    let id = courseDetails.Id[0];
    let title = courseDetails.MenuLabel[0];
    let introduction = '';

    let learningContents = mapContent(wcicData, imagesStorage);

    if (_.isArray(learningContents) && !_.isEmpty(learningContents)) {
        _.forEach(learningContents, learningContent => introduction += `&nbsp;${learningContent.text}`);
    }

    return EntityFactory.Course(id, title, introduction);
};