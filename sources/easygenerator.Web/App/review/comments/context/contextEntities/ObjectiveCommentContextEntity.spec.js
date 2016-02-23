import ObjectiveCommentContextEntity from 'review/comments/context/contextEntities/ObjectiveCommentContextEntity';

import notify from 'notify';
import router from 'plugins/router';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import getObjectiveQuery from 'review/comments/context/queries/getObjective';
import userContext from 'userContext';
import clientContext from 'clientContext';
import constants from 'constants';
import app from 'durandal/app';

describe('review context [ObjectiveCommentContextEntity]', () => {
    let courseId = 'courseId', title = 'title', objectiveId = 'objectiveId', contextEntity;
    
    beforeEach(() => {
        contextEntity = new ObjectiveCommentContextEntity(courseId, objectiveId, title);
        spyOn(eventTracker, 'publish');
        spyOn(router, 'navigate');
        spyOn(notify, 'error');
        spyOn(clientContext, 'set');
        spyOn(app, 'trigger');
        spyOn(localizationManager, 'localize').and.callFake(function (arg) {
            return arg + 'loc';
        });

        userContext.identity = {};
    });

    describe('ctor:', () => {
        it('should set properties', () => {
            expect(contextEntity.courseId).toBe(courseId);
            expect(contextEntity.title).toBe(title);
            expect(contextEntity.objectiveId).toBe(objectiveId);
        });
    });

    describe('open:', () => {
        it('should publish \'Open commented item in the editor\' event', () => {
            spyOn(contextEntity, 'getEntityUrl');
            contextEntity.open();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open commented item in the editor');
        });

        describe('when objective is defined', () => {
            beforeEach(() => {
                spyOn(getObjectiveQuery, 'execute').and.returnValue({id:objectiveId});
            });

            describe('when user has new editor', () => {
                beforeEach(() => {
                    userContext.identity.newEditor = true;
                });

                it('should set client context navigateToObjectiveId', () => {
                    contextEntity.open();
                    expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.highlightedObjectiveId, objectiveId);
                });

                it('should trigger app event', () => {
                    contextEntity.open();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.objective.navigated);
                });
            });
        });

        describe('when entity url is defined', () => {
            let url = 'urlka';
            beforeEach(() => {
                spyOn(contextEntity, 'getEntityUrl').and.returnValue(url);
                spyOn(getObjectiveQuery, 'execute').and.returnValue({});
            });

            it('should navigate by url', () => {
                contextEntity.open();
                expect(router.navigate).toHaveBeenCalledWith(url);
            });
        });

        describe('when url is null', () => {
            beforeEach(() => {
                spyOn(contextEntity, 'getEntityUrl').and.returnValue(null);
                spyOn(getObjectiveQuery, 'execute').and.returnValue(null);
            });

            it('should notify error', () => {
                contextEntity.open();
                expect(notify.error).toHaveBeenCalledWith('cannotFindCommentedItem' + 'loc');
            });
        });

    });

    describe('getEntityUrl:', () => {
        describe('when objective is found', () => {
            beforeEach(() => {
                spyOn(getObjectiveQuery, 'execute').and.returnValue({});
            });

            describe('and user is in new editor', () => {
                beforeEach(() => {
                    userContext.identity.newEditor = true;
                });

                it('should return url', () => {
                    expect(contextEntity.getEntityUrl()).toBe('courses/' + courseId);
                });
            });

            describe('and user is in old editor', () => {
                beforeEach(() => {
                    userContext.identity.newEditor = false;
                });

                it('should return url', () => {
                    expect(contextEntity.getEntityUrl()).toBe('courses/' + courseId + '/objectives/' + objectiveId);
                });
            });
        });

        describe('when objective is not found', () => {
            beforeEach(() => {
                spyOn(getObjectiveQuery, 'execute').and.returnValue();
            });

            it('should return null', () => {
                expect(contextEntity.getEntityUrl()).toBeNull();
            });
        });

    });
});