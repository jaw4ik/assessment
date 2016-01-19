import viewModel from 'viewmodels/courses/courseComments';

import userContext from 'userContext';
import eventTracker from 'eventTracker';
import commentRepository from 'repositories/commentRepository';
import constants from 'constants';
import notify from 'notify';

describe('viewModel [courseComments]', () => {

    it('should be object', () => {
        expect(viewModel).toBeObject();
    });

    describe('isCommentsLoading:', () => {

        it('should be observable', () => {
            expect(viewModel.isCommentsLoading).toBeObservable();
        });

    });

    describe('comments:', () => {

        it('should be observable', () => {
            expect(viewModel.comments).toBeObservableArray();
        });

    });

    describe('activate:', () => {

        beforeEach(() => {
            spyOn(notify, 'error');
        });

        it('should set isCommentsLoading flag to true', () => {
            spyOn(userContext, 'identify').and.returnValue(Promise.resolve());
            spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
            viewModel.isCommentsLoading(false);

            viewModel.activate('123');
            expect(viewModel.isCommentsLoading()).toBeTruthy();
        });

        describe('when courseId is not a string', () => {
            it('should show error message', () => {
                viewModel.activate({});
                expect(notify.error).toHaveBeenCalled();
            });
        });

        describe('when courseId is a string', () => {
            it('should update user identity', () => {
                spyOn(userContext, 'identify');
                viewModel.activate('123');
                expect(userContext.identify).toHaveBeenCalled();
            });

            describe('and user identity updated', () => {

                let getCommentsDefer;

                beforeEach(() => {
                    spyOn(userContext, 'identify').and.returnValue(Promise.resolve());
                    getCommentsDefer = Q.defer();
                    spyOn(commentRepository, 'getCollection').and.returnValue(getCommentsDefer.promise);
                });

                it('should update hasAccessToComments', done => {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                    viewModel.hasAccessToComments(true);

                    viewModel.activate('123').then(() => {
                        expect(viewModel.hasAccessToComments()).toBeFalsy();
                        done();    
                    });
                });

                describe('and user has no starter access', () => {
                    beforeEach(() => {
                        spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                    });

                    it('should not receive comments from repository', done => {
                        viewModel.activate('123').then(() => {
                            expect(commentRepository.getCollection).not.toHaveBeenCalled();
                            done();    
                        });
                    });
                });

                describe('and user has starter access', () => {
                    let comment = {
                        id: '1',
                        text: 'text',
                        name: 'name',
                        email: 'email',
                        createdOn: '2015-12-10'
                    };

                    beforeEach(() => {
                        spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    });

                    it('should receive comments from repository', done => {
                        getCommentsDefer.resolve([comment]);
                        viewModel.activate('123').then(() => {
                            expect(commentRepository.getCollection).toHaveBeenCalledWith('123');
                            done();
                        });
                    });

                    describe('and comments received', () => {
                        beforeEach(() => {
                            getCommentsDefer.resolve([comment]);
                        });

                        it('should update comments in viewModel', done => {
                            viewModel.comments([]);
                            viewModel.activate('123').then(() => {
                                expect(viewModel.comments()[0].id()).toBe(comment.id);
                                expect(viewModel.comments()[0].text).toBe(comment.text);
                                expect(viewModel.comments()[0].email).toBe(comment.email);
                                expect(viewModel.comments()[0].name).toBe(comment.name);
                                expect(viewModel.comments()[0].createdOn).toBe(comment.createdOn);
                                expect(viewModel.comments()[0].isDeleted()).toBeFalsy();
                                done();    
                            });
                        });

                        it('should set isCommentsLoading to false', done => {
                            viewModel.isCommentsLoading(true);
                            viewModel.activate('123').then(() => {
                                expect(viewModel.isCommentsLoading()).toBeFalsy();
                                done();    
                            });
                        });
                    });

                    describe('and comments not received', () => {
                        beforeEach(() => {
                            getCommentsDefer.reject();
                        });

                        it('should set isCommentsLoading to false', done => {
                            viewModel.isCommentsLoading(true);
                            viewModel.activate('123').then(() => {
                                expect(viewModel.isCommentsLoading()).toBeFalsy();
                                done();
                            });
                        });
                    });
                });
            });
        
            describe('and user identity is not updated', function() {
                beforeEach(function() {
                    spyOn(userContext, 'identify').and.returnValue(Promise.reject("reason"));
                });

                it('should notify error', (done) => {
                    viewModel.activate('123').then(function() {
                        expect(notify.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should set isCommentsLoading to false', (done) => {
                    viewModel.isCommentsLoading(true);
                    viewModel.activate('123').then(function() {
                        expect(viewModel.isCommentsLoading()).toBeFalsy();
                        done();
                    });
                });
            });
        });
    });

    describe('hasAccessToComments:', () => {

        it('should be observable', () => {
            expect(viewModel.hasAccessToComments).toBeObservable();
        });

    });

    describe('openUpgradePlanUrl:', () => {

        beforeEach(() => {
            spyOn(eventTracker, 'publish');
            spyOn(window, 'open');
        });

        it('should send event \'Upgrade now\'', () => {
            viewModel.openUpgradePlanUrl();
            expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.externalReview);
        });

        it('should open upgrade link in new window', () => {
            viewModel.openUpgradePlanUrl();
            expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
        });

    });

    describe('removeComment:', () => {
        let removeDefer,
            courseId = 'courseId',
            comment = {
                id: ko.observable('1'),
                text: 'text',
                name: 'name',
                email: 'email',
                createdOn: '2015-12-10',
                isDeleted: ko.observable(false)
            };

        beforeEach(() => {
            spyOn(notify, 'saved');
            spyOn(notify, 'error');
        });

        beforeEach(() => {
            viewModel.courseId = courseId;

            comment.isDeleted(false);
            viewModel.comments([comment]);

            removeDefer = Q.defer();
            spyOn(commentRepository, 'removeComment').and.returnValue(removeDefer.promise);
        });

        it('should remove comment from repository', (done) => {
            viewModel.removeComment(comment).fin(() => {
                expect(commentRepository.removeComment).toHaveBeenCalledWith(courseId, comment.id());
                done();
            });

            removeDefer.reject();
        });

        describe('when comment is removed:', () => {
            it('should set isDeleted to true', (done) => {
                viewModel.removeComment(comment).fin(() => {
                    expect(viewModel.comments()[0].isDeleted()).toBeTruthy();
                    done();
                });

                removeDefer.resolve(true);
            });

            it('should show saved notification', (done) => {
                viewModel.removeComment(comment).fin(() => {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });

                removeDefer.resolve(true);
            });
        });

        describe('when comment is not removed:', () => {
            it('should not remove it from viewModel', (done) => {
                viewModel.removeComment(comment).fin(() => {
                    expect(viewModel.comments()[0].isDeleted()).toBeFalsy();
                    done();
                });

                removeDefer.resolve(false);
            });

            it('should show error notification', (done) => {
                viewModel.removeComment(comment).fin(() => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });

                removeDefer.resolve(false);
            });
        });

        describe('when error during deleting comment:', () => {
            it('should not remove it from viewModel', (done) => {
                viewModel.removeComment(comment).fin(() => {
                    expect(viewModel.comments()[0].isDeleted()).toBeFalsy();
                    done();
                });

                removeDefer.reject();
            });

            it('should show error notification', () => {
                viewModel.removeComment(comment).fin((done) => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });

                removeDefer.reject();
            });
        });
    });

    describe('restoreComment:', () => {
        let restoreDefer,
            courseId = 'courseId',
            comment = {
                id: ko.observable('1'),
                text: 'text',
                name: 'name',
                email: 'email',
                createdOn: '2015-12-10',
                isDeleted: ko.observable(false)
            };;

        beforeEach(() => {
            spyOn(notify, 'saved');
            spyOn(notify, 'error');
        });

        beforeEach(() => {
            viewModel.courseId = courseId;

            comment.isDeleted(true);
            viewModel.comments([comment]);

            restoreDefer = Q.defer();
            spyOn(commentRepository, 'restoreComment').and.returnValue(restoreDefer.promise);
        });

        it('should call restoreComment of repository', (done) => {
            viewModel.restoreComment(comment).fin(() => {
                expect(commentRepository.restoreComment).toHaveBeenCalledWith(courseId, comment);
                done();
            });

            restoreDefer.reject();
        });

        describe('when comment is restored:', () => {
            it('should set isDeleted to false', (done) => {
                viewModel.restoreComment(comment).fin(() => {
                    expect(viewModel.comments()[0].isDeleted()).toBeFalsy();
                    done();
                });

                restoreDefer.resolve('2');
            });

            it('should set new restored id', (done) => {
                viewModel.restoreComment(comment).fin(() => {
                    expect(viewModel.comments()[0].id()).toBe('2');
                    done();
                });

                restoreDefer.resolve('2');
            });


            it('should show saved notification', (done) => {
                viewModel.restoreComment(comment).fin(() => {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });

                restoreDefer.resolve('2');
            });
        });

        describe('when comment is not restored:', () => {
            it('should not restore it in viewModel', (done) => {
                viewModel.restoreComment(comment).fin(() => {
                    expect(viewModel.comments()[0].isDeleted()).toBeTruthy();
                    done();
                });

                restoreDefer.resolve();
            });

            it('should show error notification', (done) => {
                viewModel.restoreComment(comment).fin(() => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });

                restoreDefer.resolve();
            });
        });

        describe('when error during restoring comment:', () => {
            it('should not restore it in viewModel', (done) => {
                viewModel.restoreComment(comment).fin(() => {
                    expect(viewModel.comments()[0].isDeleted()).toBeTruthy();
                    done();
                });

                restoreDefer.reject();
            });

            it('should show error notification', () => {
                viewModel.restoreComment(comment).fin((done) => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });

                restoreDefer.reject();
            });
        });
    });

    describe('deletedByCollaborator:', () => {
        let commentId = '1',
            courseId = 'courseId',
            comment = {
                id: ko.observable(commentId),
                text: 'text',
                name: 'name',
                email: 'email',
                createdOn: '2015-12-10',
                isDeleted: ko.observable(false)
            };

        describe('when courseId is correct', () => {
            it('should remove comment from viewModel', () => {
                viewModel.courseId = courseId;
                viewModel.comments([comment]);

                viewModel.deletedByCollaborator(courseId, commentId);
                expect(viewModel.comments().length).toBe(0);
            });
        });

        describe('when courseId is not correct', () => {
            it('should not remove comment from viewModel', () => {
                viewModel.courseId = courseId;
                viewModel.comments([comment]);

                viewModel.deletedByCollaborator('someId', commentId);
                expect(viewModel.comments().length).toBe(1);
            });
        });

    });

    describe('hide:', () => {
        let comment = {
            id: ko.observable('1'),
            text: 'text',
            name: 'name',
            email: 'email',
            createdOn: '2015-12-10',
            isDeleted: ko.observable(false)
        };

        it('should remove comment from viewModel', () => {
            viewModel.comments([comment]);

            viewModel.hide(comment);
            expect(viewModel.comments().length).toBe(0);
        });
    });
});