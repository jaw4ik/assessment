import constants from 'constants';
import CommentContext from 'review/comments/context/commentContexts/CommentContext';
import QuestionCommentContextEntity from 'review/comments/context/contextEntities/QuestionCommentContextEntity';

export default class extends CommentContext{
    constructor(courseId, context) {
        let descriptionLocalizationKey = 'onTheQuestion';

        if (context.property === constants.comment.context.properties.voiceOver) {
            descriptionLocalizationKey = 'onTheVoiceOverInTheQuestion';
        } else if (context.property === constants.comment.context.properties.learningContent) {
            descriptionLocalizationKey = 'onTheLearningContentInTheQuestion';
        }

        super('commented', descriptionLocalizationKey);
        this.entity = new QuestionCommentContextEntity(courseId, context.id, context.title);
    }
}