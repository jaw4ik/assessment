import _ from 'underscore';
import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';

export default (sectionId, learningObjective, modifiedOn) => {
    guard.throwIfNotString(learningObjective, 'Learning section is not a string');
    guard.throwIfNotString(sectionId, 'SectionId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

    let section = _.find(dataContext.sections, item => item.id === sectionId);

    if (!_.isObject(section)) {
        guard.throwIfNotAnObject(section, 'Section has not been found');
    }

    section.learningObjective = learningObjective;
    section.modifiedOn = new Date(modifiedOn);

    app.trigger(constants.messages.section.learningObjectiveUpdatedByCollaborator, section);
};