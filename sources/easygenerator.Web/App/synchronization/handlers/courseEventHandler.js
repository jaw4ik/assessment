define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/courseModelMapper', 'mappers/collaboratorModelMapper', 'mappers/objectiveModelMapper'],
    function (guard, app, constants, dataContext, courseModelMapper, collaboratorModelMapper, objectiveModelMapper) {
        "use strict";

        return {
            collaborationStarted: collaborationStarted,
            collaboratorAdded: collaboratorAdded,
            titleUpdated: titleUpdated,
            introducationContentUpdated: introducationContentUpdated,
            templateUpdated: templateUpdated,
            objectivesReordered: objectivesReordered,
            published: published,
            deleted: deleted
        };

        function collaborationStarted(course, objectives, user) {
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

        function collaboratorAdded(courseId, user) {
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

        function titleUpdated(courseId, title, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(title, 'Title is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            course.title = title;
            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.titleUpdated, course);
        }

        function introducationContentUpdated(courseId, introductionContent, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(introductionContent, 'Introduction content is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            course.introductionContent = introductionContent;
            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.introductionContentUpdated, course);
        }

        function templateUpdated(courseId, templateId, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(templateId, 'TemplateId content is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            var template = _.find(dataContext.templates, function (item) {
                return item.id === templateId;
            });

            guard.throwIfNotAnObject(template, 'Template has not been found');

            course.template = template;
            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.templateUpdated, course);
        }

        function objectivesReordered(courseId, objectiveIds, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotArray(objectiveIds, 'ObjectiveIds is not an array');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            course.objectives = _.map(objectiveIds, function (id) {
                return _.find(course.objectives, function (objective) {
                    return objective.id == id;
                });
            });

            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.objectivesReordered, course);
        }

        function published(courseId, publicationUrl) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(publicationUrl, 'PublicationUrl is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            course.publish.packageUrl = publicationUrl;
            app.trigger(constants.messages.course.publish.completed, course);
        }

        function deleted(courseId) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            if (_.isNullOrUndefined(course)) {
                return;
            }

            dataContext.courses = _.reject(dataContext.courses, function (item) {
                return item.id === courseId;
            });

            app.trigger(constants.messages.course.deleted, course.id);
        }

    });