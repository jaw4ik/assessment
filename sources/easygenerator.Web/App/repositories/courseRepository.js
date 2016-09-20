define(['dataContext', 'constants', 'models/course', 'guard', 'http/apiHttpWrapper', 'durandal/app', 'mappers/courseModelMapper', 'mappers/sectionModelMapper'],
    function (dataContext, constants, CourseModel, guard, apiHttpWrapper, app, courseModelMapper, sectionModelMapper) {
        "use strict";

        var repository = {
            getById: getById,
            getCollection: getCollection,

            addCourse: addCourse,
            updateCourseTitle: updateCourseTitle,
            updateCourseTemplate: updateCourseTemplate,
            removeCourse: removeCourse,
            duplicateCourse: duplicateCourse,
            updateCourseInDataContext: updateCourseInDataContext,

            relateSection: relateSection,
            unrelateSections: unrelateSections,
            updateIntroductionContent: updateIntroductionContent,
            updateSectionOrder: updateSectionOrder
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

                    var course = courseModelMapper.map(response, dataContext.sections, dataContext.templates);
                    dataContext.courses.push(course);

                    app.trigger(constants.messages.course.created, course);

                    return course;
                });
            });
        }

        function removeCourse(courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id (string) was expected');

                return apiHttpWrapper.post('api/course/delete', { courseId: courseId }).then(function (response) {
                    dataContext.courses = _.reject(dataContext.courses, function (course) {
                        return course.id === courseId;
                    });

                    app.trigger(constants.messages.course.deleted, courseId);

                    if (_.isNullOrUndefined(response) ) {
                        return;
                    }

                    var deletedSectionsData = response.deletedSectionIds;

                    dataContext.sections = _.reject(dataContext.sections, function (section) {
                        return _.contains(deletedSectionsData, section.id);
                    });

                    var learningPathsWithDeletedCourse = _.filter(dataContext.learningPaths, function (learningPath) {
                        return _.contains(response.deletedFromLearningPathIds, learningPath.id);
                    });

                    _.each(learningPathsWithDeletedCourse, function (learningPathWithDeletedCourse) {
                        learningPathWithDeletedCourse.entities = _.reject(learningPathWithDeletedCourse.entities, function (item) {
                            return item.id === courseId;
                        });
                    });
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
                    return updateCourseInDataContext(response);
                });
            });
        }
        
        function updateCourseInDataContext(data) {
            guard.throwIfNotAnObject(data, 'Response is not an object');
            guard.throwIfNotAnObject(data.course, 'Course is not an object');

            var sectionsData = data.sections;
            if (sectionsData && _.isArray(sectionsData)) {
                _.each(sectionsData, function (sectionData) {
                    var section = sectionModelMapper.map(sectionData);
                    dataContext.sections.push(section);
                });
            }

            var duplicatedCourse = courseModelMapper.map(data.course, dataContext.sections, dataContext.templates);
            duplicatedCourse.isDuplicate = true;
            dataContext.courses.push(duplicatedCourse);

            app.trigger(constants.messages.course.created, duplicatedCourse);

            return duplicatedCourse;
        }

        function relateSection(courseId, sectionId, targetIndex) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not valid');
                guard.throwIfNotString(sectionId, 'Section id is not valid');

                var requestArgs = {
                    courseId: courseId,
                    sectionId: sectionId,
                    index: targetIndex
                };

                return apiHttpWrapper.post('api/course/relateSection', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');

                    var course = _.find(dataContext.courses, function (exp) {
                        return exp.id == courseId;
                    });
                    guard.throwIfNotAnObject(course, "Course doesn`t exist");

                    var section = _.find(dataContext.sections, function (item) {
                        return item.id == sectionId;
                    });
                    guard.throwIfNotAnObject(section, "Section doesn`t exist");

                    if (!_.isNullOrUndefined(targetIndex)) {
                        course.sections.splice(targetIndex, 0, section);
                    } else {
                        course.sections.push(section);
                    }

                    app.trigger(constants.messages.course.sectionRelated, requestArgs.courseId, section, targetIndex);
                });
            });
        }

        function unrelateSections(courseId, sections) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not valid');
                guard.throwIfNotArray(sections, 'Sections to relate are not array');

                var requestArgs = {
                    courseId: courseId,
                    sections: _.map(sections, function (item) {
                        return item.id;
                    })
                };

                return apiHttpWrapper.post('api/course/unrelateSections', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');

                    var course = _.find(dataContext.courses, function (exp) {
                        return exp.id == courseId;
                    });
                    guard.throwIfNotAnObject(course, "Course doesn`t exist");

                    course.sections = _.reject(course.sections, function (section) {
                        return _.find(sections, function (item) {
                            return item.id == section.id;
                        });
                    });

                    app.trigger(constants.messages.course.sectionsUnrelated, requestArgs.courseId, requestArgs.sections);
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

                    var course = _.find(dataContext.courses, function (item) {
                        return item.id === courseId;
                    });

                    guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                    course.title = courseTitle;

                    app.trigger(constants.messages.course.titleUpdated, course);
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

                    var course = _.find(dataContext.courses, function (item) {
                        return item.id === courseId;
                    });

                    guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                    var template = _.find(dataContext.templates, function (item) {
                        return item.id === templateId;
                    });

                    guard.throwIfNotAnObject(template, 'Template does not exist in dataContext');

                    course.template = template;

                    return course.template;
                });

            });
        }

        function updateIntroductionContent(courseId, introductionContent) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');

                return apiHttpWrapper.post('api/course/updateintroductioncontent', { courseId: courseId, introductionContent: introductionContent }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');

                    var course = _.find(dataContext.courses, function (item) {
                        return item.id === courseId;
                    });

                    guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                    course.introductionContent = introductionContent;
                });
            });
        }

        function updateSectionOrder(courseId, sections) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotArray(sections, 'Sections to relate are not array');

                var requestArgs = {
                    courseId: courseId,
                    sections: _.map(sections, function (item) {
                        return item.id;
                    })
                };

                return apiHttpWrapper.post('api/course/updatesectionsorder', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response does not an object');

                    var course = _.find(dataContext.courses, function (course) {
                        return course.id == courseId;
                    });
                    guard.throwIfNotAnObject(course, "Course doesn`t exist");

                    course.sections = _.map(sections, function (item) {
                        return _.find(course.sections, function (section) {
                            return section.id == item.id;
                        });
                    });

                    app.trigger(constants.messages.course.sectionsReordered, course);
                });
            });
        }
    }
);