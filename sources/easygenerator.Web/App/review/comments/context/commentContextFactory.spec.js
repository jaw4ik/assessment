import factory from 'review/comments/context/commentContextFactory';

import constants from 'constants';
import GeneralCommentContext from 'review/comments/context/commentContexts/GeneralCommentContext';
import CourseCommentContext from 'review/comments/context/commentContexts/CourseCommentContext';
import ObjectiveCommentContext from 'review/comments/context/commentContexts/ObjectiveCommentContext';
import QuestionCommentContext from 'review/comments/context/commentContexts/QuestionCommentContext';
import InformationContentCommentContext from 'review/comments/context/commentContexts/InformationContentCommentContext';

describe('review [commentContextFactory]', () => {
    describe('createContext:', () => {
        let courseId = 'courseId';

        describe('when context is null', () => {
            it('should return general context', () => {
                expect(factory.createContext(courseId, null)).toEqual(new GeneralCommentContext());
            });
        });

        describe('when context type is \'course\'', () => {
            it('should return course context', () => {
                let context = { type: constants.comment.context.types.course };

                expect(factory.createContext(courseId, context)).toEqual(new CourseCommentContext(context));
            });
        });

        describe('when context type is \'objective\'', () => {
            it('should return objective context', () => {
                let context = { type: constants.comment.context.types.objective };

                expect(factory.createContext(courseId, context)).toEqual(new ObjectiveCommentContext(courseId, context));
            });
        });

        describe('when context type is \'question\'', () => {
            it('should return question context', () => {
                let context = { type: constants.comment.context.types.question };

                expect(factory.createContext(courseId, context)).toEqual(new QuestionCommentContext(courseId, context));
            });
        });

        describe('when context type is \'informationContent\'', () => {
            it('should return informationContent context', () => {
                let context = { type: constants.comment.context.types.informationContent };

                expect(factory.createContext(courseId, context)).toEqual(new InformationContentCommentContext(courseId, context));
            });
        });

        describe('when context type is unknown', () => {
            it('should return informationContent context', () => {
                let context = { type: 'typ4ik' };

                expect(factory.createContext(courseId, context)).toEqual(new GeneralCommentContext());
            });
        });
    });
});