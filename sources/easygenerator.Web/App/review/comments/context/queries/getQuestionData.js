import _ from 'underscore';
import dataContext from 'dataContext';

export default class {
    static execute(courseId, questionId) {
        let course = _.find(dataContext.courses, item => item.id === courseId);

        if (_.isNullOrUndefined(course)) {
            throw 'Course id is not valid';
        }

        let questionEntity;

        let section = _.find(course.sections, sectionItem => {
            let question = _.find(sectionItem.questions, item => item.id === questionId);
            if (question) {
                questionEntity = question;
            }

            return question;
        });

        if(section) {
            return {
                sectionId: section.id,
                question: questionEntity
            };
        }

        return null;
    }
}