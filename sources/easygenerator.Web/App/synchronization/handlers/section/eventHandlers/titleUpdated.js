import _ from 'underscore';
import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';

export default (sectionId, title, modifiedOn) => {
    guard.throwIfNotString(title, 'Title is not a string');
    guard.throwIfNotString(sectionId, 'SectionId is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

    var section = _.find(dataContext.sections, item => item.id === sectionId);

    if (!_.isObject(section)) {
        guard.throwIfNotAnObject(section, 'Section has not been found');
    }

    section.title = title;
    section.modifiedOn = new Date(modifiedOn);

    app.trigger(constants.messages.section.titleUpdatedByCollaborator, section);
};