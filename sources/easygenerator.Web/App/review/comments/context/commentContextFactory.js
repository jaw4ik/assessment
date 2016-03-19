import constants from 'constants';
import GeneralCommentContext from 'review/comments/context/commentContexts/GeneralCommentContext';
import CourseCommentContext from 'review/comments/context/commentContexts/CourseCommentContext';
import SectionCommentContext from 'review/comments/context/commentContexts/SectionCommentContext';
import QuestionCommentContext from 'review/comments/context/commentContexts/QuestionCommentContext';
import InformationContentCommentContext from 'review/comments/context/commentContexts/InformationContentCommentContext';

class CommentContextFactory {
    createContext(courseId, context) {
        if (!context) {
            return new GeneralCommentContext();
        }

        switch(context.type){
            case constants.comment.context.types.course: 
                return new CourseCommentContext(context);
            case constants.comment.context.types.section:
                return new SectionCommentContext(courseId, context);
            case constants.comment.context.types.question:
                return new QuestionCommentContext(courseId, context);
            case constants.comment.context.types.informationContent:
                return new InformationContentCommentContext(courseId, context);
            default:
                return new GeneralCommentContext();
        }
    }
}

export default new CommentContextFactory();