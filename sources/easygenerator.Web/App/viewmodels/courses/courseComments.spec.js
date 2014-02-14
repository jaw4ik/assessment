define(['viewmodels/courses/courseComments'],
    function (viewModel) {

        var userContext = require('userContext'),
            commentRepository = require('repositories/commentRepository');

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
                    spyOn(userContext, 'identify').andReturn(userContextIdentityDefer.promise);
                });

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    var result = viewModel.activate('123');
                    expect(result).toBePromise();
                });

                it('should set comment loading flag', function () {
                    viewModel.isCommentsLoading(false);
                    var promise = viewModel.activate('123');

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(viewModel.isCommentsLoading()).toBeTruthy();
                    });
                });

                it('should update user identity', function () {
                    var promise = userContextIdentityDefer.promise.fin(function () { });
                    viewModel.activate('123');

                    userContextIdentityDefer.reject();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(userContext.identify).toHaveBeenCalled();
                    });
                });

                describe('and user identity not updated', function () {

                    beforeEach(function () {
                        userContextIdentityDefer.reject();
                    });

                    it('should set comments loading flag to false', function() {
                        viewModel.isCommentsLoading(true);
                        var promise = userContextIdentityDefer.promise.fin(function () { });

                        viewModel.activate('123');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isCommentsLoading()).toBeFalsy();
                        });
                    });
                });

                describe('and user identity updated', function() {

                    var getCommentsDefer;

                    beforeEach(function() {
                        userContextIdentityDefer.resolve();

                        getCommentsDefer = Q.defer();

                        spyOn(commentRepository, 'getCollection').andReturn(getCommentsDefer.promise);
                    });

                    it('should update hasAccessToComments', function () {
                        viewModel.hasAccessToComments(true);
                        spyOn(userContext, 'hasStarterAccess').andReturn(false);
                        var promise = userContextIdentityDefer.promise.fin(function () { });
                        viewModel.activate('123');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.hasAccessToComments()).toBeFalsy();
                        });
                    });

                    describe('and user has no starter access', function () {

                        beforeEach(function () {
                            spyOn(userContext, 'hasStarterAccess').andReturn(false);
                        });

                        it('should not receive comments from repository', function () {
                            var promise = userContextIdentityDefer.promise.fin(function () { });
                            viewModel.activate('123');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(commentRepository.getCollection).not.toHaveBeenCalled();
                            });
                        });

                    });

                    describe('and user has starter access', function() {

                        beforeEach(function() {
                            spyOn(userContext, 'hasStarterAccess').andReturn(true);
                        });

                        it('should receive comments from repository', function() {
                            var promise = userContextIdentityDefer.promise.fin(function () { });
                            viewModel.activate('123');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(commentRepository.getCollection).toHaveBeenCalledWith('123');
                            });
                        });

                        describe('and comments received', function() {

                            var comments = [{ id: '1' }];

                            beforeEach(function() {
                                getCommentsDefer.resolve(comments);
                            });

                            it('should update comments in viewModel', function () {
                                viewModel.comments([]);
                                var promise = userContextIdentityDefer.promise.fin(function () { });
                                viewModel.activate('123');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.comments()).toEqual(comments);
                                });
                            });

                        });

                        describe('and comments not received', function () {

                            beforeEach(function () {
                                getCommentsDefer.reject();
                            });

                            it('should update comments in viewModel', function () {
                                viewModel.isCommentsLoading(true);
                                var promise = userContextIdentityDefer.promise.fin(function () { });
                                viewModel.activate('123');

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.isCommentsLoading()).toBeFalsy();
                                });
                            });

                        });
                    });

                });

            });

            describe('hasAccessToComments:', function () {

                it('should be observable', function() {
                    expect(viewModel.hasAccessToComments).toBeObservable();
                });

            });

        });

    }
);