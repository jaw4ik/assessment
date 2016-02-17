'use strict';

var EntityFactory = require('../models/EntityFactory');
var Guard = require('../components/Guard');

module.exports = data => {
	Guard.throwIfNotAnObject(data, 'Data (objective)');
    Guard.throwIfNotAnObject(data.ChapterDetails, 'Data.ChapterDetails (objective)');

    let objectiveDetails = data.ChapterDetails.Node[0];
    let id = objectiveDetails.Id[0];
    let title = objectiveDetails.MenuLabel[0];
    let order = objectiveDetails.Position[0];

    return EntityFactory.Objective(id, title, order);
};