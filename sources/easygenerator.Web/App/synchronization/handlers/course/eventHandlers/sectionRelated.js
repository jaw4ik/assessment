define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/sectionModelMapper'],
    function (guard, app, constants, dataContext, sectionModelMapper) {
        "use strict";

        return function(courseId, sectionData, targetIndex, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotAnObject(sectionData, 'Section is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function(item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            var section = sectionModelMapper.map(sectionData);
            var sectionExists = _.some(dataContext.sections, function(item) {
                return item.id === section.id;
            });

            if (!sectionExists) {
                dataContext.sections.push(section);
            }

            course.sections = _.reject(course.sections, function(item) {
                return item.id == section.id;
            });

            if (!_.isNullOrUndefined(targetIndex)) {
                course.sections.splice(targetIndex, 0, section);
            } else {
                course.sections.push(section);
            }

            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.sectionRelatedByCollaborator, courseId, section, targetIndex);
        };

    });