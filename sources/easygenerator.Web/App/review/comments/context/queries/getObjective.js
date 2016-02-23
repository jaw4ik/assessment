import _ from 'underscore';
import dataContext from 'dataContext';

export default class {
    static execute(courseId, objectiveId) {
        let course = _.find(dataContext.courses, item => item.id === courseId);

        if (_.isNullOrUndefined(course)) {
            throw 'Course id is not valid';
        }

        let objective = _.find(course.objectives, item => item.id === objectiveId);

        return objective ? objective : null;
    }
}