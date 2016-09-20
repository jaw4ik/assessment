import _ from 'underscore';
import http from 'http/apiHttpWrapper';
import repository from 'repositories/courseRepository';

export default class {
    static async execute(id) {
        var response = await http.post('api/course/duplicate', { courseId: id, hasSameName: true });
        var course = repository.updateCourseInDataContext(response);
        return course;
    }
}