import _ from 'underscore';
import dataContext from 'dataContext';
import http from 'http/apiHttpWrapper';
import commentMapper from 'mappers/commentModelMapper';

export default class {
    static async execute(courseId) {
        var course = _.find(dataContext.courses, item => item.id === courseId);

        if (_.isNullOrUndefined(course)) {
            throw 'Course id is not valid';
        }

        if (_.isArray(course.comments))
            return course.comments;

        let response = await http.post('api/comments', { courseId: courseId });
        course.comments = _.map(response.Comments, comment => commentMapper.map(comment));

        return course.comments;
    }
}