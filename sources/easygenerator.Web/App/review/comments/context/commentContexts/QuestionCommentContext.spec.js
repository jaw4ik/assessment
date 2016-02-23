import QuestionCommentContext from 'review/comments/context/commentContexts/QuestionCommentContext';

import constants from 'constants';
import localizationManager from 'localization/localizationManager';
import QuestionCommentContextEntity from 'review/comments/context/contextEntities/QuestionCommentContextEntity';

describe('review context [QuestionCommentContext]', () => {
    beforeEach(() => {
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg + 'loc';
        });
    });

    describe('constructor:', () => {
        let contextData = { id: 'id', title: 'title' },
            courseId = 'courseId';

        describe('when context property is \'voiceOver\'', () => {
            beforeEach(() => {
                contextData.property = constants.comment.context.properties.voiceOver;
            });

            it('should set properties', () => {
                let verbKey = 'commented',
                    descriptionKey = 'onTheVoiceOverInTheQuestion';

                let context = new QuestionCommentContext(courseId, contextData);
                expect(context.verb).toBe(verbKey + 'loc');
                expect(context.description).toBe(descriptionKey + 'loc');
                expect(context.entity).toEqual(new QuestionCommentContextEntity(courseId, contextData.id, contextData.title));
            });
        });

        describe('when context property is \'learningContent\'', () => {
            beforeEach(() => {
                contextData.property = constants.comment.context.properties.learningContent;
            });

            it('should set properties', () => {
                let verbKey = 'commented',
                    descriptionKey = 'onTheLearningContentInTheQuestion';

                let context = new QuestionCommentContext(courseId, contextData);
                expect(context.verb).toBe(verbKey + 'loc');
                expect(context.description).toBe(descriptionKey + 'loc');
                expect(context.entity).toEqual(new QuestionCommentContextEntity(courseId, contextData.id, contextData.title));
            });
        });

        describe('when context property is not voiceOver or learningContent', () => {
            beforeEach(() => {
                contextData.property = constants.comment.context.properties.title;
            });

            it('should set properties', () => {
                let verbKey = 'commented',
                    descriptionKey = 'onTheQuestion';

                let context = new QuestionCommentContext(courseId, contextData);
                expect(context.verb).toBe(verbKey + 'loc');
                expect(context.description).toBe(descriptionKey + 'loc');
                expect(context.entity).toEqual(new QuestionCommentContextEntity(courseId, contextData.id, contextData.title));
            });
        });
      
    });
});