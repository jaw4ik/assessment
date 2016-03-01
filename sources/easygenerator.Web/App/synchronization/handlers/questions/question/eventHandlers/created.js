define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/questionModelMapper'],
    function (guard, app, constants, dataContext, questionModelMapper) {
        "use strict";

        return function (sectionId, newQuestion, modifiedOn) {
            guard.throwIfNotString(sectionId, 'SectionId is not a string');
            guard.throwIfNotAnObject(newQuestion, 'Question is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var section = _.find(dataContext.sections, function (item) {
                return item.id == sectionId;
            });

            if (!_.isObject(section)) {
                guard.throwIfNotAnObject(section, 'Section has not been found');
            }

            var question = _.find(section.questions, function(item) {
                return item.id == newQuestion.Id;
            });

            if (!_.isNullOrUndefined(question))
                return;

            var mappedQuestion = questionModelMapper.map(newQuestion);
            section.questions.push(mappedQuestion);
            section.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.createdByCollaborator, sectionId, mappedQuestion);
        }
    });