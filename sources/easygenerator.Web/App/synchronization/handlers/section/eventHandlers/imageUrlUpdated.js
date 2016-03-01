import _ from 'underscore';
import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';

export default (sectionId, imageUrl, modifiedOn) => {
    guard.throwIfNotString(sectionId, 'SectionId is not a string');
    guard.throwIfNotString(imageUrl, 'ImageUrl is not a string');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

    let section = _.find(dataContext.sections, item => item.id === sectionId);

    if (!_.isObject(section)) {
        guard.throwIfNotAnObject(section, 'Section has not been found');
    }

    section.image = imageUrl;
    section.modifiedOn = new Date(modifiedOn);

    app.trigger(constants.messages.section.imageUrlUpdatedByCollaborator, section);
};