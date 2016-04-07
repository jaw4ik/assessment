import QuestionCommentContextEntity from 'review/comments/context/contextEntities/QuestionCommentContextEntity';

import notify from 'notify';
import router from 'plugins/router';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import getQuestionDataQuery from 'review/comments/context/queries/getQuestionData';
import constants from 'constants';
import userContext from 'userContext';
import clientContext from 'clientContext';
import app from 'durandal/app';

describe('review context [QuestionCommentContextEntity]', () => {
    let courseId = 'courseId', 
        title = 'title', 
        sectionId = 'sectionId', 
        questionId = 'questionId', 
        contextEntity;
    
    beforeEach(() => {
        contextEntity = new QuestionCommentContextEntity(courseId, questionId, title);
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(notify, 'error');
        spyOn(app, 'trigger');
        spyOn(clientContext, 'set');
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg + 'loc';
        });
        userContext.identity = {};
    });

    describe('ctor:', () => {
        it('should set properties', () => {
            expect(contextEntity.courseId).toBe(courseId);
            expect(contextEntity.title).toBe(title);
            expect(contextEntity.questionId).toBe(questionId);
        });
    });

    describe('getEntityUrl:', () => {
        describe('when question is found', () => {
            beforeEach(() => {
                spyOn(getQuestionDataQuery, 'execute').and.returnValue({
                    sectionId: sectionId
                });
            });

            describe('and user is in new editor', () => {
                beforeEach(() => {
                    userContext.identity.newEditor = true;
                });

                it('should return url', () => {
                    expect(contextEntity.getEntityUrl()).toBe('courses/' + courseId + '/sections/' + sectionId);
                });
            });

            describe('and user is in old editor', () => {
                beforeEach(() => {
                    userContext.identity.newEditor = false;
                });

                it('should return url', () => {
                    expect(contextEntity.getEntityUrl()).toBe('courses/' + courseId + '/sections/' + sectionId + '/questions/' + questionId);
                });
            });
        });

        describe('when question is not found', () => {
            beforeEach(() => {
                spyOn(getQuestionDataQuery, 'execute').and.returnValue(null);
            });

            it('should return null', () => {
                expect(contextEntity.getEntityUrl()).toBeNull();
            });
        });

    });

    describe('open:', () => {
        it('should publish \'Open commented item in the editor\' event', () => {
            spyOn(getQuestionDataQuery, 'execute').and.returnValue(null);
            spyOn(contextEntity, 'getEntityUrl').and.returnValue(null);
            contextEntity.open();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open commented item in the editor');
        });

        describe('when question is defined', () => {
            beforeEach(() => {
                spyOn(getQuestionDataQuery, 'execute').and.returnValue({
                    sectionId: sectionId
                });
            });

            describe('when user has new editor', () => {
                beforeEach(() => {
                    userContext.identity.newEditor = true;
                });

                it('should set client context navigateToSectionId', () => {
                    contextEntity.open();
                    expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.questionDataToNavigate, { questionId: questionId, sectionId: sectionId });
                });

                it('should trigger app event', () => {
                    contextEntity.open();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.navigated);
                });
            });
        });

        describe('when entity url is defined', () => {
            let url = 'urlka';
            beforeEach(() => {
                spyOn(contextEntity, 'getEntityUrl').and.returnValue(url);
                spyOn(getQuestionDataQuery, 'execute').and.returnValue({
                    sectionId: sectionId
                });
            });

            it('should navigate by url', () => {
                contextEntity.open();
                expect(router.navigate).toHaveBeenCalledWith(url);
            });
        });

        describe('when url is null', () => {
            beforeEach(() => {
                spyOn(contextEntity, 'getEntityUrl').and.returnValue(null);
                spyOn(getQuestionDataQuery, 'execute').and.returnValue(null);
            });

            it('should notify error', () => {
                contextEntity.open();
                expect(notify.error).toHaveBeenCalledWith('cannotFindCommentedItem' + 'loc');
            });
        });

    });
});