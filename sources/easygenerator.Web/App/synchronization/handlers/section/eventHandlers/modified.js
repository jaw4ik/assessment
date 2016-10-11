import guard from 'guard';
import app from 'durandal/app';
import constants from 'constants';
import dataContext from 'dataContext';

export default function(sectionId, modifiedOn) {
    guard.throwIfNotString(sectionId, 'SectionId is not a string');
    guard.throwIfNotDate(new Date(modifiedOn), 'ModifiedOn is not a date');    
    
    let section = _.find(dataContext.sections, item => item.id === sectionId);

    if(!_.isUndefined(section)) {
        section.modifiedOn = modifiedOn;

        app.trigger(constants.messages.section.modified, section);
    }
};