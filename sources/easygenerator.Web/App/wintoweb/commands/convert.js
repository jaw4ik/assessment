import fileUpload from 'fileUpload';
import Command from 'Command';
import dataContext from 'dataContext';
import sectionModelMapper from 'mappers/sectionModelMapper';
import courseModelMapper from 'mappers/courseModelMapper';
import constants from 'constants';
import app from 'durandal/app';
import _ from 'underscore';
import getTicket from './getTicket';

function processImportedCourse(courseData, sectionsData) {
    _.each(sectionsData, sectionData => {
        var section = sectionModelMapper.map(sectionData);
        dataContext.sections.push(section);
    });

    var course = courseModelMapper.map(courseData, dataContext.sections, dataContext.templates);
    dataContext.courses.push(course);

    app.trigger(constants.messages.course.created, course);

    if (course.sections.length) {
        app.trigger(constants.messages.section.createdInCourse);
    }

    if (course.sections.length && course.sections[0].questions.length) {
        app.trigger(constants.messages.question.created, course.sections[0].id, course.sections[0].questions[0]);
    }

    return course;
}

export default new Command(file => {
    return window.auth.getHeader('api').then(value => {
        var headers = value;
        return getTicket.execute().then(response => {
            headers['ticket'] = response.Token;
            return fileUpload.xhr2(constants.winToWeb.host, file, headers).then(function(response) {
                if (!response || !response[0] || !response[0].data)
                    return;

                let data = response[0].data;
                let course = processImportedCourse(data.course, data.sections);
                return course;
            }).then(data => {}, reason => {}, progress => {});
        });
    });
});