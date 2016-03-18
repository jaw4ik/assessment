define(['guard', 'durandal/app', 'constants', 'dataContext', 'userContext'],
    function (guard, app, constants, dataContext, userContext) {
        "use strict";

        return function sectionsUnrelated(courseId, sectionIds, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotArray(sectionIds, 'SectionIds is not an array');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function(item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            var unrelatedSections = _.filter(course.sections, function(item) {
                return _.some(sectionIds, function(id) {
                    return item.id == id;
                });
            });

            unrelatedSections = _.map(unrelatedSections, function(item) {
                return item.id;
            });

            course.sections = _.reject(course.sections, function(section) {
                return _.some(sectionIds, function(item) {
                    return item == section.id;
                });
            });

            dataContext.sections = _.reject(dataContext.sections, function(section) {
                return _.some(sectionIds, function(item) {
                    return item == section.id && section.createdBy !== userContext.identity.email;
                });
            });

            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.sectionsUnrelatedByCollaborator, course.id, unrelatedSections);
        };

    });