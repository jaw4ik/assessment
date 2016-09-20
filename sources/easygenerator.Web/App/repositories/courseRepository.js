import guard from 'guard';
import app from 'durandal/app';
import constants from 'constants';
import dataContext from 'dataContext';
import apiHttpWrapper from 'http/apiHttpWrapper';
import courseModelMapper from 'mappers/courseModelMapper';
import sectionModelMapper from 'mappers/sectionModelMapper';

class CourseRepository {
    async getCollection() {
        return dataContext.courses;
    }

    async getById(id) {
        guard.throwIfNotString(id, 'Course id (string) was expected');

        var result = _.find(dataContext.courses, function (item) {
            return item.id === id;
        });

        if (_.isUndefined(result)) {
            throw 'Course with this id is not found';
        };

        return result;
    }

    async addCourse(title, templateId) {
        guard.throwIfNotString(title, 'Course title (string) was expected');
        guard.throwIfNotString(templateId, 'TemplateId (string) was expected');

        let response = await apiHttpWrapper.post('api/course/create', { title: title, templateId: templateId });
        guard.throwIfNotAnObject(response, 'Response is not an object');

        var course = courseModelMapper.map(response, dataContext.sections, dataContext.templates);
        dataContext.courses.push(course);

        app.trigger(constants.messages.course.created, course);

        return course;
    }

    async removeCourse(courseId) {
        guard.throwIfNotString(courseId, 'Course id (string) was expected');

        let response = await apiHttpWrapper.post('api/course/delete', { courseId: courseId });

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
    }

    async duplicateCourse(courseId) {
        var course = _.find(dataContext.courses, function (exp) {
            return exp.id === courseId;
        });
        guard.throwIfNotAnObject(course, 'Course doesn`t exist');

        let response = await apiHttpWrapper.post('api/course/duplicate', { courseId: courseId });
        return this.updateCourseInDataContext(response);
    }

    updateCourseInDataContext(data) {
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

    async relateSection(courseId, sectionId, targetIndex) {
        guard.throwIfNotString(courseId, 'Course id is not valid');
        guard.throwIfNotString(sectionId, 'Section id is not valid');

        var requestArgs = {
            courseId: courseId,
            sectionId: sectionId,
            index: targetIndex
        };

        let response = await apiHttpWrapper.post('api/course/relateSection', requestArgs);
        guard.throwIfNotAnObject(response, 'Response is not an object');

        var course = _.find(dataContext.courses, function (exp) {
            return exp.id === courseId;
        });
        guard.throwIfNotAnObject(course, 'Course doesn`t exist');

        var section = _.find(dataContext.sections, function (item) {
            return item.id === sectionId;
        });
        guard.throwIfNotAnObject(section, 'Section doesn`t exist');

        if (!_.isNullOrUndefined(targetIndex)) {
            course.sections.splice(targetIndex, 0, section);
        } else {
            course.sections.push(section);
        }

        app.trigger(constants.messages.course.sectionRelated, requestArgs.courseId, section, targetIndex);
    }

    async unrelateSections(courseId, sections) {
        guard.throwIfNotString(courseId, 'Course id is not valid');
        guard.throwIfNotArray(sections, 'Sections to relate are not array');

        var requestArgs = {
            courseId: courseId,
            sections: _.map(sections, function (item) {
                return item.id;
            })
        };

        let response = await apiHttpWrapper.post('api/course/unrelateSections', requestArgs);
        guard.throwIfNotAnObject(response, 'Response is not an object');

        var course = _.find(dataContext.courses, function (exp) {
            return exp.id === courseId;
        });
        guard.throwIfNotAnObject(course, 'Course doesn`t exist');

        course.sections = _.reject(course.sections, function (section) {
            return _.find(sections, function (item) {
                return item.id === section.id;
            });
        });

        app.trigger(constants.messages.course.sectionsUnrelated, requestArgs.courseId, requestArgs.sections);
    }

    async updateCourseTitle(courseId, courseTitle) {
        guard.throwIfNotString(courseId, 'Course id is not a string');
        guard.throwIfNotString(courseTitle, 'Course title is not a string');

        var requestArgs = {
            courseId: courseId,
            courseTitle: courseTitle
        };

        let response = await apiHttpWrapper.post('api/course/updateTitle', requestArgs);
        guard.throwIfNotAnObject(response, 'Response is not an object');

        var course = _.find(dataContext.courses, function (item) {
            return item.id === courseId;
        });

        guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

        course.title = courseTitle;

        app.trigger(constants.messages.course.titleUpdated, course);
    }

    async updateCourseTemplate(courseId, templateId) {
        guard.throwIfNotString(courseId, 'Course id is not a string');
        guard.throwIfNotString(templateId, 'Template id is not a string');

        var requestArgs = {
            courseId: courseId,
            templateId: templateId
        };

        let response = await apiHttpWrapper.post('api/course/updateTemplate', requestArgs);
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
    }

    async updateIntroductionContent(courseId, introductionContent) {
        guard.throwIfNotString(courseId, 'Course id is not a string');

        let response = await apiHttpWrapper.post('api/course/updateintroductioncontent', { courseId, introductionContent });
        guard.throwIfNotAnObject(response, 'Response is not an object');

        var course = _.find(dataContext.courses, function (item) {
            return item.id === courseId;
        });

        guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

        course.introductionContent = introductionContent;
    }

    async updateSectionOrder(courseId, sections) {
        guard.throwIfNotString(courseId, 'Course id is not a string');
        guard.throwIfNotArray(sections, 'Sections to relate are not array');

        var requestArgs = {
            courseId: courseId,
            sections: _.map(sections, function (item) {
                return item.id;
            })
        };

        let response = await apiHttpWrapper.post('api/course/updatesectionsorder', requestArgs);
        guard.throwIfNotAnObject(response, 'Response does not an object');

        var course = _.find(dataContext.courses, function (course) {
            return course.id === courseId;
        });
        guard.throwIfNotAnObject(course, 'Course doesn`t exist');

        course.sections = _.map(sections, function (item) {
            return _.find(course.sections, function (section) {
                return section.id === item.id;
            });
        });

        app.trigger(constants.messages.course.sectionsReordered, course);
    }

    async grantAccess(courseId, users, sendInvite = false) {
        guard.throwIfNotString(courseId, 'Course id is not a string');
        guard.throwIfNotDefined(users, 'Users list to grant access are not defined');

        if (_.isString(users)) {
            users = [users];
        }

        let response = await apiHttpWrapper.post('api/course/grantaccess', { courseId, users, sendInvite });
        guard.throwIfNotAnObject(response, 'Response does not an object');

        var course = _.find(dataContext.courses, course => course.id === courseId);
        guard.throwIfNotAnObject(course, 'Course doesn`t exist');

        _.each(users, user => {
            let entry = _.find(course.publicationAccessControlList, entry => entry.userIdentity === user);
            if (!entry) {
                course.publicationAccessControlList.unshift({
                    userIdentity: user,
                    userInvited: sendInvite
                });
            } else if (sendInvite) {
                entry.userInvited = sendInvite;
            }
        });
    }

    async removeAccess(courseId, userIdentity) {
        guard.throwIfNotString(courseId, 'Course id is not a string');
        guard.throwIfNotString(userIdentity, 'Users list to grant access are not array');

        let response = await apiHttpWrapper.post('api/course/removeaccess', { courseId, userIdentity });
        guard.throwIfNotAnObject(response, 'Response does not an object');

        var course = _.find(dataContext.courses, course => course.id === courseId);
        guard.throwIfNotAnObject(course, 'Course doesn`t exist');

        course.publicationAccessControlList = _.reject(course.publicationAccessControlList, accessEntry => accessEntry.userIdentity === userIdentity);
    }
}

export default new CourseRepository();