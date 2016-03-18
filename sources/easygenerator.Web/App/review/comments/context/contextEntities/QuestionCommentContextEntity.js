import CommentContextEntity from 'review/comments/context/contextEntities/CommentContextEntity';
import getQuestionDataQuery from 'review/comments/context/queries/getQuestionData';

export default class extends CommentContextEntity {
    constructor(courseId, questionId, questionTitle) {
        super(courseId, questionTitle);
        this.questionId = questionId;
    }

    getEntityUrl() {
        let questionData = getQuestionDataQuery.execute(this.courseId, this.questionId);
        if (!questionData)
            return null;

        return 'courses/' + this.courseId + '/sections/' + questionData.sectionId + '/questions/' + this.questionId;
    }
}