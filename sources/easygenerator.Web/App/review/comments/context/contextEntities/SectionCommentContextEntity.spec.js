import SectionCommentContextEntity from 'review/comments/context/contextEntities/SectionCommentContextEntity';

import notify from 'notify';
import router from 'routing/router';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import getSectionQuery from 'review/comments/context/queries/getSection';
import userContext from 'userContext';
import clientContext from 'clientContext';
import constants from 'constants';
import app from 'durandal/app';

describe('review context [SectionCommentContextEntity]', () => {
    let courseId = 'courseId', title = 'title', sectionId = 'sectionId', contextEntity;
    
    beforeEach(() => {
        contextEntity = new SectionCommentContextEntity(courseId, sectionId, title);
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
            expect(contextEntity.sectionId).toBe(sectionId);
        });
    });

    describe('open:', () => {
        it('should publish \'Open commented item in the editor\' event', () => {
            spyOn(getSectionQuery, 'execute');
            spyOn(contextEntity, 'getEntityUrl');
            contextEntity.open();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open commented item in the editor');
        });

        describe('when section is defined', () => {
            beforeEach(() => {
                spyOn(getSectionQuery, 'execute').and.returnValue({id:sectionId});
            });

            describe('when user has new editor', () => {
                beforeEach(() => {
                    userContext.identity.newEditor = true;
                });

                it('should set client context navigateToSectionId', () => {
                    contextEntity.open();
                    expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.highlightedSectionId, sectionId);
                });

                it('should trigger app event', () => {
                    contextEntity.open();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.navigated);
                });
            });
        });

        describe('when entity url is defined', () => {
            let url = 'urlka';
            beforeEach(() => {
                spyOn(contextEntity, 'getEntityUrl').and.returnValue(url);
                spyOn(getSectionQuery, 'execute').and.returnValue({});
            });

            it('should navigate by url', () => {
                contextEntity.open();
                expect(router.navigate).toHaveBeenCalledWith(url);
            });
        });

        describe('when url is null', () => {
            beforeEach(() => {
                spyOn(contextEntity, 'getEntityUrl').and.returnValue(null);
                spyOn(getSectionQuery, 'execute').and.returnValue(null);
            });

            it('should notify error', () => {
                contextEntity.open();
                expect(notify.error).toHaveBeenCalledWith('cannotFindCommentedItem' + 'loc');
            });
        });

    });

    describe('getEntityUrl:', () => {
        describe('when section is found', () => {
            beforeEach(() => {
                spyOn(getSectionQuery, 'execute').and.returnValue({});
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
                    expect(contextEntity.getEntityUrl()).toBe('courses/' + courseId + '/sections/' + sectionId);
                });
            });
        });

        describe('when section is not found', () => {
            beforeEach(() => {
                spyOn(getSectionQuery, 'execute').and.returnValue();
            });

            it('should return null', () => {
                expect(contextEntity.getEntityUrl()).toBeNull();
            });
        });

    });
});