define(function (require) {

    var
        viewModel = require('viewmodels/shell'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        dataContext = require('dataContext'),
        userContext = require('userContext');

    describe('viewModel [shell]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'setLocation');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('homeModule', function () {

            it('should be defined', function () {
                expect(viewModel.homeModuleName).toBeDefined();
            });

            it('should equal \'courses\'', function () {
                expect(viewModel.homeModuleName).toEqual('courses');
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when dataContext initialized', function() {

                var dataContextDefer, routerActivateDefer;
                beforeEach(function() {
                    dataContextDefer = Q.defer();
                    routerActivateDefer = Q.defer();
                    
                    spyOn(dataContext, 'initialize').andReturn(dataContextDefer.promise);
                    spyOn(router, 'activate').andReturn(routerActivateDefer.promise);
                    
                    dataContextDefer.resolve();
                    routerActivateDefer.resolve();
                });

                describe('when user is anonymous', function() {

                    beforeEach(function() {
                        userContext.identity = null;
                    });

                    it('should set isTryMode to true', function() {
                        var promise = viewModel.activate();

                        waitsFor(function() {
                            return !promise.isPending();
                        });
                        runs(function() {
                            expect(viewModel.isTryMode).toBeTruthy();
                        });
                    });

                    it('should set username to null', function() {
                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.username).toBeNull();
                        });
                    });

                });

                describe('when user is not anonymous', function() {

                    beforeEach(function() {
                        userContext.identity = {};
                    });
                    
                    describe('and when user does not have fullname', function () {

                        beforeEach(function () {
                            userContext.identity = {
                                email: 'usermail@easygenerator.com',
                                fullname: ' '
                            };
                        });

                        it('should set email to username', function () {
                            var promise = viewModel.activate();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.username).toBe(userContext.identity.email);
                            });
                        });

                    });

                    describe('and when user has fullname', function () {

                        beforeEach(function () {
                            userContext.identity = { fullname: 'username' };
                        });

                        it('should set fullname to username', function () {
                            var promise = viewModel.activate();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.username).toBe(userContext.identity.fullname);
                            });
                        });

                    });

                });

            });

        });

        describe('username:', function () {

            it('should be defined', function () {
                expect(viewModel.username).toBeDefined();
            });

        });

        describe('showNavigation:', function () {

            it('should be defined', function () {
                expect(viewModel.showNavigation).toBeDefined();
            });

            it('should be function', function () {
                expect(viewModel.showNavigation).toBeFunction();
            });

            describe('when activeModuleName is error page', function () {

                describe('when error page 400', function () {

                    it('should be return true', function () {
                        spyOn(viewModel, 'activeModuleName').andReturn('400');
                        expect(viewModel.showNavigation()).toBeTruthy();
                    });

                });

                describe('when error page 404', function () {

                    it('should be return true', function () {
                        spyOn(viewModel, 'activeModuleName').andReturn('404');
                        expect(viewModel.showNavigation()).toBeTruthy();
                    });

                });

            });

            describe('when activeModuleName is not error page', function () {

                it('should be return fasle', function () {
                    spyOn(viewModel, 'activeModuleName').andReturn('somepage');
                    expect(viewModel.showNavigation()).toBeFalsy();
                });

            });

        });

    });

});