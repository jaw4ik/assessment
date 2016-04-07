import CommentContextEntity from 'review/comments/context/contextEntities/CommentContextEntity';
import getQuestionDataQuery from 'review/comments/context/queries/getQuestionData';
import constants from 'constants';
import userContext from 'userContext';
import clientContext from 'clientContext';
import app from 'durandal/app';

export default class extends CommentContextEntity {
    constructor(courseId, questionId, questionTitle) {
        super(courseId, questionTitle);
        this.questionId = questionId;
    }

    getEntityUrl() {
        let questionData = getQuestionDataQuery.execute(this.courseId, this.questionId);
        if (!questionData)
            return null;

        let url = 'courses/' + this.courseId + '/sections/' + questionData.sectionId;
        if(!userContext.identity.newEditor) {
            url += '/questions/' + this.questionId;
        }

        return url;
    }

    open() {
        let questionData = getQuestionDataQuery.execute(this.courseId, this.questionId);
        if (questionData && userContext.identity.newEditor) {
            clientContext.set(constants.clientContextKeys.questionDataToNavigate, { questionId: this.questionId, sectionId: questionData.sectionId });
            app.trigger(constants.messages.question.navigated);
        }

        super.open();
    }
}