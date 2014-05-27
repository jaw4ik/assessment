define(['dataContext', 'constants', 'models/course', 'guard', 'http/httpWrapper', 'durandal/app', 'userContext', 'models/collaborator'],
    function (dataContext, constants, CourseModel, guard, httpWrapper, app, userContext, CollaboratorModel) {
        "use strict";

        var repository = {
            getById: getById,
            getCollection: getCollection,

            addCourse: addCourse,
            updateCourseTitle: updateCourseTitle,
            updateCourseTemplate: updateCourseTemplate,
            removeCourse: removeCourse,

            relateObjective: relateObjective,
            unrelateObjectives: unrelateObjectives,
            updateIntroductionContent: updateIntroductionContent,
            updateObjectiveOrder: updateObjectiveOrder
        };

        return repository;

        function getCollection() {
            return Q.fcall(function () {
                return dataContext.courses;
            });
        }

        function getById(id) {
            return Q.fcall(function () {
                guard.throwIfNotString(id, 'Course id (string) was expected');

                var result = _.find(dataContext.courses, function (item) {
                    return item.id === id;
                });

                if (_.isUndefined(result)) {
                    throw 'Course with this id is not found';
                };

                return result;
            });
        }

        function addCourse(title, templateId) {
            return Q.fcall(function () {
                guard.throwIfNotString(title, 'Title is not a string');
                guard.throwIfNotString(templateId, 'TemplateId is not a string');

                var requestArgs = {
                    title: title,
                    templateId: templateId
                };

                return httpWrapper.post('api/course/create', requestArgs).then(function (response) {

                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.Id, 'Response Id is not a string');
                    guard.throwIfNotString(response.CreatedOn, 'Response CreatedOn is not a string');
                    guard.throwIfNotString(response.CreatedBy, 'Response CreatedBy is not a string');

                    var template = _.find(dataContext.templates, function (item) {
                        return item.id === templateId;
                    });

                    guard.throwIfNotAnObject(template, 'Template does not exist in dataContext');
                    
                    var
                        courseId = response.Id,
                        createdOn = new Date(response.CreatedOn),
                        createdCourse = new CourseModel({
                            id: courseId,
                            title: title,
                            template: {
                                id: template.id,
                                name: template.name,
                                image: template.image
                            },
                            collaborators: [
                                new CollaboratorModel({
                                    email: userContext.identity.email,
                                    fullName: userContext.identity.fullname,
                                    createdOn: createdOn
                                })
                            ],
                            objectives: [],
                            createdOn: createdOn,
                            createdBy: response.CreatedBy,
                            modifiedOn: createdOn
                        });

                    dataContext.courses.push(createdCourse);

                    app.trigger(constants.messages.course.created, createdCourse);

                    return {
                        id: createdCourse.id,
                        createdOn: createdCourse.createdOn
                    };
                });
            });
        }

        function removeCourse(courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id (string) was expected');

                return httpWrapper.post('api/course/delete', { courseId: courseId }).then(function () {
                    dataContext.courses = _.reject(dataContext.courses, function (course) {
                        return course.id === courseId;
                    });

                    app.trigger(constants.messages.course.deleted, courseId);
                });
            });
        }


        function relateObjective(courseId, objective, targetIndex) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not valid');
                guard.throwIfNotAnObject(objective, 'Objective is not an object');

                var requestArgs = {
                    courseId: courseId,
                    objectiveId: objective.id,
                    index: targetIndex
                };

                return httpWrapper.post('api/course/relateObjective', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var course = _.find(dataContext.courses, function (exp) {
                        return exp.id == courseId;
                    });

                    guard.throwIfNotAnObject(course, "Course doesn`t exist");

                    course.modifiedOn = new Date(response.ModifiedOn);

                    if (!_.isNullOrUndefined(targetIndex)) {
                        course.objectives.splice(targetIndex, 0, objective);
                    } else {
                        course.objectives.push(objective);
                    }

                    app.trigger(constants.messages.course.objectiveRelated, requestArgs.courseId, objective, targetIndex);

                    return {
                        modifiedOn: course.modifiedOn
                    };
                });
            });
        }

        function unrelateObjectives(courseId, objectives) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not valid');
                guard.throwIfNotArray(objectives, 'Objectives to relate are not array');

                var requestArgs = {
                    courseId: courseId,
                    objectives: _.map(objectives, function (item) {
                        return item.id;
                    })
                };

                return httpWrapper.post('api/course/unrelateObjectives', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var course = _.find(dataContext.courses, function (exp) {
                        return exp.id == courseId;
                    });
                    guard.throwIfNotAnObject(course, "Course doesn`t exist");

                    course.objectives = _.reject(course.objectives, function (objective) {
                        return _.find(objectives, function (item) {
                            return item.id == objective.id;
                        });
                    });

                    course.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.course.objectivesUnrelated, requestArgs.courseId, requestArgs.objectives);

                    return course.modifiedOn;
                });
            });
        }

        function updateCourseTitle(courseId, courseTitle) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(courseTitle, 'Course title is not a string');

                var requestArgs = {
                    courseId: courseId,
                    courseTitle: courseTitle
                };

                return httpWrapper.post('api/course/updateTitle', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var course = _.find(dataContext.courses, function (item) {
                        return item.id === courseId;
                    });

                    guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                    course.title = courseTitle;
                    course.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.course.titleUpdated, course);

                    return course.modifiedOn;
                });

            });
        }

        function updateCourseTemplate(courseId, templateId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(templateId, 'Template id is not a string');

                var requestArgs = {
                    courseId: courseId,
                    templateId: templateId
                };

                return httpWrapper.post('api/course/updateTemplate', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var course = _.find(dataContext.courses, function (item) {
                        return item.id === courseId;
                    });

                    guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                    var template = _.find(dataContext.templates, function (item) {
                        return item.id === templateId;
                    });

                    guard.throwIfNotAnObject(template, 'Template does not exist in dataContext');

                    course.template = { id: template.id, name: template.name, image: template.image };
                    course.modifiedOn = new Date(response.ModifiedOn);

                    return {
                        modifiedOn: course.modifiedOn
                    };
                });

            });
        }

        function updateIntroductionContent(courseId, introductionContent) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(introductionContent, 'Introduction content is not a string');

                return httpWrapper.post('api/course/updateintroductioncontent', { courseId: courseId, introductionContent: introductionContent }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var course = _.find(dataContext.courses, function (item) {
                        return item.id === courseId;
                    });

                    guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                    var modifiedOn = new Date(response.ModifiedOn);

                    course.introductionContent = introductionContent;
                    course.modifiedOn = modifiedOn;

                    return modifiedOn;
                });
            });
        }

        function updateObjectiveOrder(courseId, objectives) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotArray(objectives, 'Objectives to relate are not array');

                var requestArgs = {
                    courseId: courseId,
                    objectives: _.map(objectives, function (item) {
                        return item.id;
                    })
                };

                return httpWrapper.post('api/course/updateobjectivesorder', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response does not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var course = _.find(dataContext.courses, function (course) {
                        return course.id == courseId;
                    });
                    guard.throwIfNotAnObject(course, "Course doesn`t exist");

                    course.objectives = _.map(objectives, function (item) {
                        return _.find(course.objectives, function (objective) {
                            return objective.id == item.id;
                        });
                    });

                    course.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.course.objectivesReordered, course);

                    return course.modifiedOn;
                });
            });
        }
    }
);