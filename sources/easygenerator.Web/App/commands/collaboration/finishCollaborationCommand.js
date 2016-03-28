import _ from 'underscore';
import dataContext from 'dataContext';
import http from 'http/apiHttpWrapper';
import userContext from 'userContext';
import constants from 'constants';
import app from 'durandal/app';

export default class {
    static async execute(courseId) {
        var username = userContext.identity.email;
        await http.post('api/course/collaboration/finish', { courseId: courseId, collaboratorEmail: username });

        dataContext.courses = _.reject(dataContext.courses, function(course) {
            return course.id === courseId;
        });

        dataContext.sections = _.reject(dataContext.sections, function(section) {
            return section.createdBy !== username && !sectionRelatedToAvailableCourses(section.id);
        });

        app.trigger(constants.messages.course.collaboration.finished, courseId);

        function sectionRelatedToAvailableCourses(sectionId) {
            return _.some(dataContext.courses, function(course) {
                return _.some(course.sections, function(section) {
                    return section.id === sectionId;
                });
            });
        }
    }
}