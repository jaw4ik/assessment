import constants from 'constants';
import CommentContext from 'review/comments/context/commentContexts/CommentContext';

export default class extends CommentContext {
    constructor(context) {
        super('commented', context.property === constants.comment.context.properties.title ? 'onTheTitleOfTheCourse' : 'onTheIntroductionOfTheCourse');
    }
}