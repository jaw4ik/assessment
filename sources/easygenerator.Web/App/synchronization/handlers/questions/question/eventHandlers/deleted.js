define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function(sectionId, questionIds, modifiedOn) {
            guard.throwIfNotArray(questionIds, 'QuestionIds is not an array');
            guard.throwIfNotString(sectionId, 'SectionId is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var section = _.find(dataContext.sections, function (item) {
                return item.id == sectionId;
            });

            if (!_.isObject(section)) {
                guard.throwIfNotAnObject(section, 'Section has not been found');
            }

            section.questions = _.reject(section.questions, function (item) {
                return _.indexOf(questionIds, item.id) != -1;
            });

            section.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.deletedByCollaborator, sectionId, questionIds);
        }
    });