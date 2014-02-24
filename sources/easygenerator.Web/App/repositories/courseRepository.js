﻿define(['dataContext', 'constants', 'plugins/http', 'models/course', 'guard', 'httpWrapper', 'durandal/app'],
    function (dataContext, constants, http, CourseModel, guard, httpWrapper, app) {

        var
            getCollection = function () {
                return Q.fcall(function () {
                    return httpWrapper.post('api/courses').then(function () {
                        return dataContext.courses;
                    });
                });
            },

            getById = function (id) {
                return Q.fcall(function () {
                    guard.throwIfNotString(id, 'Course id (string) was expected');

                    var requestArgs = {
                        courseId: id
                    };

                    return httpWrapper.post('api/courseExists', requestArgs).then(function () {
                        var result = _.find(dataContext.courses, function (item) {
                            return item.id === id;
                        });

                        if (_.isUndefined(result)) {
                            throw 'Course with this id is not found';
                        };

                        return result;
                    });
                });
            },

        addCourse = function (title, templateId) {
            return Q.fcall(function () {
                guard.throwIfNotString(title, 'Title is not a string');
                guard.throwIfNotString(templateId, 'TemplateId is not a string');

                var requestArgs = {
                    title: title,
                    templateId: templateId
                };

                return httpWrapper.post('api/course/create', requestArgs)
                    .then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.Id, 'Response Id is not a string');
                        guard.throwIfNotString(response.CreatedOn, 'Response CreatedOn is not a string');

                        var template = _.find(dataContext.templates, function (item) {
                            return item.id === templateId;
                        });

                        guard.throwIfNotAnObject(template, 'Template does not exist in dataContext');

                        var
                            courseId = response.Id,
                            createdOn = new Date(parseInt(response.CreatedOn.substr(6), 10)),
                            createdCourse = new CourseModel({
                                id: courseId,
                                title: title,
                                template: {
                                    id: template.id,
                                    name: template.name,
                                    image: template.image
                                },
                                objectives: [],
                                createdOn: createdOn,
                                modifiedOn: createdOn
                            });

                        dataContext.courses.push(createdCourse);

                        app.trigger('course:created', createdCourse);

                        return {
                            id: createdCourse.id,
                            createdOn: createdCourse.createdOn
                        };
                    });
            });
        },

        removeCourse = function (courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id (string) was expected');

                return httpWrapper.post('api/course/delete', { courseId: courseId }).then(function () {
                    dataContext.courses = _.reject(dataContext.courses, function (course) {
                        return course.id === courseId;
                    });

                    app.trigger('course:deleted', courseId);
                });
            });
        },

        relateObjectives = function (courseId, objectives) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not valid');
                guard.throwIfNotArray(objectives, 'Objectives to relate are not array');

                var requestArgs = {
                    courseId: courseId,
                    objectives: _.map(objectives, function (item) {
                        return item.id;
                    })
                };

                return httpWrapper.post('api/course/relateObjectives', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');
                    guard.throwIfNotArray(response.RelatedObjectives, 'Response does not have related objectives collection');

                    var course = _.find(dataContext.courses, function (exp) {
                        return exp.id == courseId;
                    });

                    guard.throwIfNotAnObject(course, "Course doesn`t exist");

                    course.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));
                    var relatedObjectives = _.filter(objectives, function (item) {
                        return !_.isUndefined(_.find(response.RelatedObjectives, function (relatedObjective) {
                            return item.id == relatedObjective.Id;
                        }));
                    });

                    _.each(relatedObjectives, function (objective) {
                        course.objectives.push(objective);
                    });

                    app.trigger('course:objectivesRelated', requestArgs.courseId, relatedObjectives);

                    return {
                        modifiedOn: course.modifiedOn,
                        relatedObjectives: relatedObjectives
                    };
                });
            });
        },

        unrelateObjectives = function (courseId, objectives) {
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

                    course.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                    app.trigger('course:objectivesUnrelated', requestArgs.courseId, requestArgs.objectives);

                    return course.modifiedOn;
                });
            });
        },

        updateCourseTitle = function (courseId, courseTitle) {
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
                    course.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                    app.trigger('course:titleUpdated', course);

                    return course.modifiedOn;
                });

            });
        },

        updateCourseTemplate = function (courseId, templateId) {
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
                    course.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                    return {
                        modifiedOn: course.modifiedOn
                    };
                });

            });
        },

        updateIntroductionContent = function (courseId, introductionContent) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');

                return httpWrapper.post('api/course/updateintroductioncontent', { courseId: courseId, introductionContent: introductionContent })
                    .then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                        var course = _.find(dataContext.courses, function (item) {
                            return item.id === courseId;
                        });

                        guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                        var modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                        course.introductionContent = introductionContent;
                        course.modifiedOn = modifiedOn;

                        return modifiedOn;
                    });
            });
        },

        updateObjectiveOrder = function (courseId, objectives) {
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

                    course.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                    app.trigger('course:objectivesReordered', course);

                    return course.modifiedOn;
                });
            });
        };

        return {
            getById: getById,
            getCollection: getCollection,

            addCourse: addCourse,
            updateCourseTitle: updateCourseTitle,
            updateCourseTemplate: updateCourseTemplate,
            removeCourse: removeCourse,

            relateObjectives: relateObjectives,
            unrelateObjectives: unrelateObjectives,
            updateIntroductionContent: updateIntroductionContent,
            updateObjectiveOrder: updateObjectiveOrder
        };
    }
);