define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/courseModelMapper', 'mappers/collaboratorModelMapper', 'mappers/objectiveModelMapper'],
    function (guard, app, constants, dataContext, courseModelMapper, collaboratorModelMapper, objectiveModelMapper) {
        "use strict";

        return {
            courseCollaborationStarted: courseCollaborationStarted,
            courseCollaboratorAdded: courseCollaboratorAdded,
            courseTitleUpdated: courseTitleUpdated,
            courseIntroducationContentUpdated: courseIntroducationContentUpdated
        };

        function courseCollaborationStarted(course, objectives, user) {
            guard.throwIfNotAnObject(course, 'Course is not an object');
            guard.throwIfNotArray(objectives, 'Objectives is not an array');
            guard.throwIfNotAnObject(user, 'User is not an object');

            var collaborator = collaboratorModelMapper.map(user);

            _.each(objectives, function (objective) {
                var objectiveExists = _.some(dataContext.objectives, function (obj) {
                    return obj.id === objective.Id;
                });

                if (!objectiveExists) {
                    dataContext.objectives.push(objectiveModelMapper.map(objective));
                }
            });

            var existingCourse = _.find(dataContext.courses, function (item) {
                return item.id == course.Id;
            });

            if (_.isObject(existingCourse)) {
                existingCourse.collaborators.push(collaborator);
            } else {
                existingCourse = courseModelMapper.map(course, dataContext.objectives, dataContext.templates);
                dataContext.courses.push(existingCourse);
            }

            app.trigger(constants.messages.course.collaboration.started, existingCourse);
        }

        function courseCollaboratorAdded(courseId, user) {
            guard.throwIfNotString(courseId, 'courseId is not a string');
            guard.throwIfNotAnObject(user, 'User is not an object');

            var collaborator = collaboratorModelMapper.map(user);

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course is not an object');
            course.collaborators.push(collaborator);

            app.trigger(constants.messages.course.collaboration.collaboratorAdded, courseId, collaborator);
        }

        function courseTitleUpdated(courseId, title, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(title, 'Title is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            if (!_.isObject(course)) {
                guard.throwIfNotAnObject(course, 'Course has not been found');
            }

            course.title = title;
            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.titleUpdated, course);
        }

        function courseIntroducationContentUpdated(courseId, introductionContent, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(introductionContent, 'Introduction content is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            if (!_.isObject(course)) {
                guard.throwIfNotAnObject(course, 'Course has not been found');
            }

            course.introductionContent = introductionContent;
            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.introductionContentUpdated, course);
        }
    });