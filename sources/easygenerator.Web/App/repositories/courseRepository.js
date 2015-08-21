define(['dataContext', 'constants', 'models/course', 'guard', 'http/apiHttpWrapper', 'durandal/app', 'mappers/courseModelMapper', 'mappers/objectiveModelMapper'],
    function (dataContext, constants, CourseModel, guard, apiHttpWrapper, app, courseModelMapper, objectiveModelMapper) {
        "use strict";

        var repository = {
            getById: getById,
            getCollection: getCollection,

            addCourse: addCourse,
            updateCourseTitle: updateCourseTitle,
            updateCourseTemplate: updateCourseTemplate,
            removeCourse: removeCourse,
            duplicateCourse: duplicateCourse,

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

                guard.throwIfNotString(title, 'Course title (string) was expected');
                guard.throwIfNotString(templateId, 'TemplateId (string) was expected');

                return apiHttpWrapper.post('api/course/create', { title: title, templateId: templateId }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');

                    var course = courseModelMapper.map(response, dataContext.objectives, dataContext.templates);
                    dataContext.courses.push(course);

                    app.trigger(constants.messages.course.created, course);

                    return course;
                });
            });
        }

        function removeCourse(courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id (string) was expected');

                return apiHttpWrapper.post('api/course/delete', { courseId: courseId }).then(function () {
                    dataContext.courses = _.reject(dataContext.courses, function (course) {
                        return course.id === courseId;
                    });

                    app.trigger(constants.messages.course.deleted, courseId);
                });
            });
        }

        function duplicateCourse(courseId) {
            return Q.fcall(function () {
                var course = _.find(dataContext.courses, function (exp) {
                    return exp.id == courseId;
                });
                guard.throwIfNotAnObject(course, "Course doesn`t exist");

                return apiHttpWrapper.post('api/course/duplicate', { courseId: courseId }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotAnObject(response.course, 'Course is not an object');
                    
                    var objectivesData = response.objectives;
                    if (objectivesData && _.isArray(objectivesData)) {
                        _.each(objectivesData, function (objectiveData) {
                            var objective = objectiveModelMapper.map(objectiveData);
                            dataContext.objectives.push(objective);
                        });
                    }
                    
                    var duplicatedCourse = courseModelMapper.map(response.course, dataContext.objectives, dataContext.templates);
                    dataContext.courses.push(duplicatedCourse);

                    app.trigger(constants.messages.course.created, duplicatedCourse);

                    return duplicatedCourse;
                });
            });
        }


        function relateObjective(courseId, objectiveId, targetIndex) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not valid');
                guard.throwIfNotString(objectiveId, 'Objective id is not valid');

                var requestArgs = {
                    courseId: courseId,
                    objectiveId: objectiveId,
                    index: targetIndex
                };

                return apiHttpWrapper.post('api/course/relateObjective', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var course = _.find(dataContext.courses, function (exp) {
                        return exp.id == courseId;
                    });
                    guard.throwIfNotAnObject(course, "Course doesn`t exist");

                    var objective = _.find(dataContext.objectives, function (item) {
                        return item.id == objectiveId;
                    });
                    guard.throwIfNotAnObject(objective, "Objective doesn`t exist");

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

                return apiHttpWrapper.post('api/course/unrelateObjectives', requestArgs).then(function (response) {
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

                return apiHttpWrapper.post('api/course/updateTitle', requestArgs).then(function (response) {
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

                return apiHttpWrapper.post('api/course/updateTemplate', requestArgs).then(function (response) {
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

                    course.template = template;
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

                return apiHttpWrapper.post('api/course/updateintroductioncontent', { courseId: courseId, introductionContent: introductionContent }).then(function (response) {
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

                return apiHttpWrapper.post('api/course/updateobjectivesorder', requestArgs).then(function (response) {
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