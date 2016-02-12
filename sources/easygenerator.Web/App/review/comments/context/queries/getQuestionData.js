import _ from 'underscore';
import dataContext from 'dataContext';

export default class {
    static execute(courseId, questionId) {
        let course = _.find(dataContext.courses, item => item.id === courseId);

        if (_.isNullOrUndefined(course)) {
            throw 'Course id is not valid';
        }

        let questionEntity;

        let objective = _.find(course.objectives, objectiveItem => {
            let question = _.find(objectiveItem.questions, item => item.id === questionId);
            if (question) {
                questionEntity = question;
            }

            return question;
        });

        if(objective) {
            return {
                objectiveId: objective.id,
                question: questionEntity
            };
        }

        return null;
    }
}