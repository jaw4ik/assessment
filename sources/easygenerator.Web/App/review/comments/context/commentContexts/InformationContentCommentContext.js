import constants from 'constants';
import CommentContext from 'review/comments/context/commentContexts/CommentContext';
import QuestionCommentContextEntity from 'review/comments/context/contextEntities/QuestionCommentContextEntity';

export default class extends CommentContext{
    constructor(courseId, context) {
        super('commented', context.property === constants.comment.context.properties.voiceOver ? 'onTheVoiceOverInTheContentItem' : 'onTheContentItem');
        this.entity = new QuestionCommentContextEntity(courseId, context.id, context.title);
    }
}