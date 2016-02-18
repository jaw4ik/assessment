﻿import Objective from 'models/objective';
import constants from 'constants';
import questionModelMapper from './questionModelMapper';

export default {
    map: item => new Objective({
        id: item.Id,
        title: item.Title,
        createdBy: item.CreatedBy,
        learningObjective: item.LearningObjective,
        createdOn: new Date(item.CreatedOn),
        modifiedOn: new Date(item.ModifiedOn),
        image: item.ImageUrl,
        questions: _.map(item.Questions, questionModelMapper.map)
    })
};