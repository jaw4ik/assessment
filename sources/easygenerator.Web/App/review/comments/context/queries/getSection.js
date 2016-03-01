import _ from 'underscore';
import dataContext from 'dataContext';

export default class {
    static execute(courseId, sectionId) {
        let course = _.find(dataContext.courses, item => item.id === courseId);

        if (_.isNullOrUndefined(course)) {
            throw 'Course id is not valid';
        }

        let section = _.find(course.sections, item => item.id === sectionId);

        return section ? section : null;
    }
}