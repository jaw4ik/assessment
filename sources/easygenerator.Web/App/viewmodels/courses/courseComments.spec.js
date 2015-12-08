define(['viewmodels/courses/courseComments'],
    function (viewModel) {

        var userContext = require('userContext'),
            commentRepository = require('repositories/commentRepository'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            notify = require('notify');

        describe('viewModel [courseComments]', function () {

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('isCommentsLoading:', function () {

                it('should be observable', function () {
                    expect(viewModel.isCommentsLoading).toBeObservable();
                });

            });

            describe('comments:', function () {

                it('should be observable', function () {
                    expect(viewModel.comments).toBeObservableArray();
                });

            });

            describe('activate:', function () {

                var userContextIdentityDefer;

                beforeEach(function () {
                    userContextIdentityDefer = Q.defer();
                    spyOn(userContext, 'identify').and.returnValue(userContextIdentityDefer.promise);
                });

                describe('when courseId is not a string', function () {

                    it('should reject promise', function (done) {
                        var promise = viewModel.activate({});

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('Course id is not a string');
                            done();
                        });
                    });

                });

                describe('when courseId is a string', function () {

                    it('should be function', function () {
                        expect(viewModel.activate).toBeFunction();
                    });

                    it('should return promise', function () {
                        var result = viewModel.activate('123');
                        expect(result).toBePromise();
                    });

                    it('should set comment loading flag', function (done) {
                        viewModel.isCommentsLoading(false);
                        userContextIdentityDefer.reject();

                        viewModel.activate('123');

                        userContextIdentityDefer.promise.fin(function () {
                            expect(viewModel.isCommentsLoading()).toBeTruthy();
                            done();
                        });
                    });

                    it('should update user identity', function (done) {
                        userContextIdentityDefer.reject();

                        viewModel.activate('123');

                        userContextIdentityDefer.promise.fin(function () {
                            expect(userContext.identify).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('and user identity not updated', function () {

                        beforeEach(function () {
                            userContextIdentityDefer.reject();
                        });

                        it('should set comments loading flag to false', function (done) {
                            viewModel.activate('123').fin(function () {
                                expect(viewModel.isCommentsLoading()).toBeFalsy();
                                done();
                            });
                        });
                    });

                    describe('and user identity updated', function () {

                        var getCommentsDefer;

                        beforeEach(function () {
                            userContextIdentityDefer.resolve();

                            getCommentsDefer = Q.defer();
                            spyOn(commentRepository, 'getCollection').and.returnValue(getCommentsDefer.promise);
                        });

                        it('should update hasAccessToComments', function (done) {
                            spyOn(userContext, 'hasStarterAccess').and.returnValue(false);

                            viewModel.hasAccessToComments(true);

                            viewModel.activate('123');

                            userContextIdentityDefer.promise.fin(function () {
                                expect(viewModel.hasAccessToComments()).toBeFalsy();
                                done();
                            });
                        });

                        describe('and user has no starter access', function () {

                            beforeEach(function () {
                                spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                            });

                            it('should not receive comments from repository', function (done) {
                                viewModel.activate('123');

                                userContextIdentityDefer.promise.fin(function () {
                                    expect(commentRepository.getCollection).not.toHaveBeenCalled();
                                    done();
                                });
                            });

                        });

                        describe('and user has starter access', function () {

                            beforeEach(function () {
                                spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                            });

                            it('should receive comments from repository', function (done) {
                                viewModel.activate('123');

                                userContextIdentityDefer.promise.fin(function () {
                                    expect(commentRepository.getCollection).toHaveBeenCalledWith('123');
                                    done();
                                });
                            });

                            describe('and comments received', function () {

                                var comments = [{ id: '1' }];

                                beforeEach(function () {
                                    getCommentsDefer.resolve(comments);
                                });

                                it('should update comments in viewModel', function (done) {
                                    viewModel.comments([]);
                                    viewModel.activate('123');

                                    viewModel.activate('123').fin(function () {
                                        expect(viewModel.comments()).toEqual(comments);
                                        done();
                                    });
                                });

                            });

                            describe('and comments not received', function () {

                                beforeEach(function () {
                                    getCommentsDefer.reject();
                                });

                                it('should update comments in viewModel', function (done) {
                                    viewModel.isCommentsLoading(true);
                                    viewModel.activate('123').fin(function () {
                                        expect(viewModel.isCommentsLoading()).toBeFalsy();
                                        done();
                                    });
                                });

                            });
                        });

                    });
                });

            });

            describe('hasAccessToComments:', function () {

                it('should be observable', function () {
                    expect(viewModel.hasAccessToComments).toBeObservable();
                });

            });

            describe('openUpgradePlanUrl:', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(window, 'open');
                });

                it('should be function', function () {
                    expect(viewModel.openUpgradePlanUrl).toBeFunction();
                });

                it('should send event \'Upgrade now\'', function () {
                    viewModel.openUpgradePlanUrl();
                    expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.externalReview);
                });

                it('should open upgrade link in new window', function () {
                    viewModel.openUpgradePlanUrl();
                    expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
                });

            });

            describe('removeComment:', function () {
                var removeDefer,
                    courseId = 'courseId',
                    comment = { id: '1' };

                beforeEach(function() {
                    spyOn(notify, 'saved');
                    spyOn(notify, 'error');
                });

                it('should be function', function () {
                    expect(viewModel.removeComment).toBeFunction();
                });

                beforeEach(function () {
                    viewModel.courseId = courseId;
                    viewModel.comments([comment]);

                    removeDefer = Q.defer();
                    spyOn(commentRepository, 'removeComment').and.returnValue(removeDefer.promise);
                });

                it('should remove comment from repository', function (done) {
                    viewModel.removeComment(comment).fin(function () {
                        expect(commentRepository.removeComment).toHaveBeenCalledWith(courseId, comment.id);
                        done();
                    });

                    removeDefer.reject();
                });

                describe('when comment is removed:', function () {
                    it('should remove it from viewModel', function (done) {
                        viewModel.removeComment(comment).fin(function () {
                            expect(viewModel.comments().length).toBe(0);
                            done();
                        });

                        removeDefer.resolve(true);
                    });

                    it('should show saved notification', function (done) {
                        viewModel.removeComment(comment).fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });

                        removeDefer.resolve(true);
                    });
                });

                describe('when comment is not removed:', function () {
                    it('should not remove it from viewModel', function (done) {
                        viewModel.removeComment(comment).fin(function () {
                            expect(viewModel.comments().length).toBe(1);
                            done();
                        });

                        removeDefer.resolve(false);
                    });

                    it('should show error notification', function (done) {
                        viewModel.removeComment(comment).fin(function () {
                            expect(notify.error).toHaveBeenCalled();
                            done();
                        });

                        removeDefer.resolve(false);
                    });
                });

                describe('when error during deleting comment:', function () {
                    it('should not remove it from viewModel', function (done) {
                        viewModel.removeComment(comment).fin(function () {
                            expect(viewModel.comments().length).toBe(1);
                            done();
                        });

                        removeDefer.reject();
                    });

                    it('should show error notification', function () {
                        viewModel.removeComment(comment).fin(function (done) {
                            expect(notify.error).toHaveBeenCalled();
                            done();
                        });

                        removeDefer.reject();
                    });
                });
            });
        });

    }
);