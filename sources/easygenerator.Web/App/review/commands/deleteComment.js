import _ from 'underscore';
import dataContext from 'dataContext';
import http from 'http/apiHttpWrapper';

export default class {
    static async execute(courseId, commentId) {
        var course = _.find(dataContext.courses, item => item.id === courseId);

        if (_.isNullOrUndefined(course)) {
            throw 'Course id is not valid';
        }

        let response = await http.post('api/comment/delete', { courseId: courseId, commentId: commentId });
        if(response && course.comments){
            course.comments = _.reject(course.comments, item => item.id === commentId);
        }

        return response;
    }
}