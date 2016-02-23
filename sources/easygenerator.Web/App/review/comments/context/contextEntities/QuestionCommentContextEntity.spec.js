import QuestionCommentContextEntity from 'review/comments/context/contextEntities/QuestionCommentContextEntity';

import notify from 'notify';
import router from 'plugins/router';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import getQuestionDataQuery from 'review/comments/context/queries/getQuestionData';

describe('review context [QuestionCommentContextEntity]', () => {
    let courseId = 'courseId', 
        title = 'title', 
        objectiveId = 'objectiveId', 
        questionId = 'questionId', 
        contextEntity;
    
    beforeEach(() => {
        contextEntity = new QuestionCommentContextEntity(courseId, questionId, title);
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(notify, 'error');
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg + 'loc';
        });
    });

    describe('ctor:', () => {
        it('should set properties', () => {
            expect(contextEntity.courseId).toBe(courseId);
            expect(contextEntity.title).toBe(title);
            expect(contextEntity.questionId).toBe(questionId);
        });
    });

    describe('open:', () => {
        it('should publish \'Open commented item in the editor\' event', () => {
            spyOn(contextEntity, 'getEntityUrl');
            contextEntity.open();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open commented item in the editor');
        });

        describe('when entity url is defined', () => {
            let url = 'urlka';

            beforeEach(() => {
                spyOn(contextEntity, 'getEntityUrl').and.returnValue(url);
            });

            it('should navigate by url', () => {
                contextEntity.open();
                expect(router.navigate).toHaveBeenCalledWith(url);
            });
        });

        describe('when entity url is not defined', () => {
            beforeEach(() => {
                spyOn(contextEntity, 'getEntityUrl').and.returnValue(null);
            });

            it('should notify error', () => {
                contextEntity.open();
                expect(notify.error).toHaveBeenCalledWith('cannotFindCommentedItem' + 'loc');
            });
        });

    });

    describe('getEntityUrl:', () => {
        describe('when question data is defined', () => {
            beforeEach(() => {
                spyOn(getQuestionDataQuery, 'execute').and.returnValue({
                    objectiveId: objectiveId
                });
            });

            it('should return url', () => {
                expect(contextEntity.getEntityUrl()).toBe('courses/' + courseId + '/objectives/' + objectiveId + '/questions/' + questionId);
            });
        });

        describe('when question data is null', () => {
            beforeEach(() => {
                spyOn(getQuestionDataQuery, 'execute').and.returnValue(null);
            });

            it('should return null', () => {
                expect(contextEntity.getEntityUrl()).toBeNull();
            });
        });

    });
});