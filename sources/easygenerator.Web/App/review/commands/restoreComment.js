import _ from 'underscore';
import dataContext from 'dataContext';
import http from 'http/apiHttpWrapper';

export default class {
    static async execute(courseId, comment) {
        var course = _.find(dataContext.courses, item => item.id === courseId);

        if (_.isNullOrUndefined(course)) {
            throw 'Course id is not valid';
        }

        let data = {
            courseId: courseId,
            text: comment.text,
            createdByName: comment.name,
            createdBy: comment.email,
            createdOn: comment.createdOn,
            context: comment.context ? JSON.stringify(comment.context) : null
        };

        let response = await http.post('api/comment/restore', data);
        if(response && course.comments) {
            course.comments.push(comment);
        }

        return response;
    }
}