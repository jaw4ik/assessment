import CommentContext from 'review/comments/context/commentContexts/CommentContext';
import SectionCommentContextEntity from 'review/comments/context/contextEntities/SectionCommentContextEntity';

export default class extends CommentContext{
    constructor(courseId, context) {
        super('commented', 'onTheTitleOfTheSection');
        this.entity = new SectionCommentContextEntity(courseId, context.id, context.title);
    }
}