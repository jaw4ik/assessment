define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, sectionIds, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotArray(sectionIds, 'SectionIds is not an array');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            course.sections = _.map(sectionIds, function (id) {
                return _.find(course.sections, function (section) {
                    return section.id == id;
                });
            });

            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.sectionsReorderedByCollaborator, course);
        }
    });