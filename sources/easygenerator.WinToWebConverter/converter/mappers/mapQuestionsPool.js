'use strict';

var EntityFactory = require('../models/EntityFactory');
var Guard = require('../components/Guard');

module.exports = data => {
	Guard.throwIfNotAnObject(data, 'Data (question pool)');
    Guard.throwIfNotAnObject(data.QuestionPoolDetails, 'Data.QuestionPoolDetails (question pool)');

    let questionPoolDetails = data.QuestionPoolDetails;
    let id = questionPoolDetails.Node[0].Id[0];
	let parentId = questionPoolDetails.Node[0].ParentId[0];

    return EntityFactory.QuestionsPool(id, parentId);
};