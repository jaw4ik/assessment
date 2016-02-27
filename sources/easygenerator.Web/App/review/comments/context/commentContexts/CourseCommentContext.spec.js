import CourseCommentContext from 'review/comments/context/commentContexts/CourseCommentContext';

import constants from 'constants';
import localizationManager from 'localization/localizationManager';

describe('review context [CourseCommentContext]', () => {
    beforeEach(() => {
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg + 'loc';
        });
    });

    describe('constructor:', () => {
        let contextData = {};

        describe('when context property is \'title\'', () => {
            beforeEach(() => {
                contextData.property = constants.comment.context.properties.title;
            });

            it('should set properties', () => {
                let verbKey = 'commented',
                    descriptionKey = 'onTheTitleOfTheCourse';

                let context = new CourseCommentContext(contextData);
                expect(context.verb).toBe(verbKey + 'loc');
                expect(context.description).toBe(descriptionKey + 'loc');
            });
        });

        describe('when context property is \'introduction\'', () => {
            beforeEach(() => {
                contextData.property = constants.comment.context.properties.introduction;
            });

            it('should set properties', () => {
                let verbKey = 'commented',
                    descriptionKey = 'onTheIntroductionOfTheCourse';

                let context = new CourseCommentContext(contextData);
                expect(context.verb).toBe(verbKey + 'loc');
                expect(context.description).toBe(descriptionKey + 'loc');
            });
        });
    });
});