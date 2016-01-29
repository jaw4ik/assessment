import fileUpload from 'fileUpload';
import Command from 'Command';
import dataContext from 'dataContext';
import objectiveModelMapper from 'mappers/objectiveModelMapper';
import courseModelMapper from 'mappers/courseModelMapper';
import constants from 'constants';
import app from 'durandal/app';
import _ from 'underscore';
import getTicket from './getTicket';

function processImportedCourse(courseData, objectivesData) {
    _.each(objectivesData, objectiveData => {
        var objective = objectiveModelMapper.map(objectiveData);
        dataContext.objectives.push(objective);
    });

    var course = courseModelMapper.map(courseData, dataContext.objectives, dataContext.templates);
    dataContext.courses.push(course);

    app.trigger(constants.messages.course.created, course);

    if (course.objectives.length) {
        app.trigger(constants.messages.objective.createdInCourse);
    }

    if (course.objectives.length && course.objectives[0].questions.length) {
        app.trigger(constants.messages.question.created, course.objectives[0].id, course.objectives[0].questions[0]);
    }

    return course;
}

export default new Command(file => {
    var headers = window.auth.getHeader('api');
    return getTicket.execute().then(response => {
        headers['ticket'] = response.Token;
        return fileUpload.xhr2(constants.winToWeb.host, file, headers).then(function(response) {
            if (!response || !response[0] || !response[0].data)
                return;

            let data = response[0].data;
            let course = processImportedCourse(data.course, data.objectives);
            return course;
        }).then(data => {}, reason => {}, progress => {});
    });
});