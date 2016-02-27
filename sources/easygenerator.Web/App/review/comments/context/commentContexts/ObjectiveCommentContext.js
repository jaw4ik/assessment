import CommentContext from 'review/comments/context/commentContexts/CommentContext';
import ObjectiveCommentContextEntity from 'review/comments/context/contextEntities/ObjectiveCommentContextEntity';

export default class extends CommentContext{
    constructor(courseId, context) {
        super('commented', 'onTheTitleOfTheSection');
        this.entity = new ObjectiveCommentContextEntity(courseId, context.id, context.title);
    }
}