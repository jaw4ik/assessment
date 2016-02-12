import CommentContext from 'review/comments/context/commentContexts/CommentContext';

export default class extends CommentContext{
    constructor() {
        super('left', 'generalComment');
    }
}