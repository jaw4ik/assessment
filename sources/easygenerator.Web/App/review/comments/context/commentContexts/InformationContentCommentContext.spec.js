import InformationContentCommentContext from 'review/comments/context/commentContexts/InformationContentCommentContext';

import constants from 'constants';
import localizationManager from 'localization/localizationManager';
import QuestionCommentContextEntity from 'review/comments/context/contextEntities/QuestionCommentContextEntity';

describe('review context [InformationContentCommentContext]', () => {
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
                    descriptionKey = 'onTheVoiceOverInTheContentItem';

                let context = new InformationContentCommentContext(courseId, contextData);
                expect(context.verb).toBe(verbKey + 'loc');
                expect(context.description).toBe(descriptionKey + 'loc');
                expect(context.entity).toEqual(new QuestionCommentContextEntity(courseId, contextData.id, contextData.title));
            });
        });

        describe('when context property is not \'voiceOver\'', () => {
            beforeEach(() => {
                contextData.property = constants.comment.context.properties.introduction;
            });

            it('should set properties', () => {
                let verbKey = 'commented',
                    descriptionKey = 'onTheContentItem';

                let context = new InformationContentCommentContext(courseId, contextData);
                expect(context.verb).toBe(verbKey + 'loc');
                expect(context.description).toBe(descriptionKey + 'loc');
                expect(context.entity).toEqual(new QuestionCommentContextEntity(courseId, contextData.id, contextData.title));
            });
        });
      
    });
});