define(['viewmodels/shell'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        dataContext = require('dataContext'),
        userContext = require('userContext')

    ;

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

            var dataContextDefer;

            beforeEach(function () {
                dataContextDefer = Q.defer();
                spyOn(dataContext, 'initialize').and.returnValue(dataContextDefer.promise);
                dataContextDefer.resolve();
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            describe('when dataContext initialized', function () {

                var routerActivateDefer;

                beforeEach(function () {
                    routerActivateDefer = Q.defer();
                    spyOn(router, 'activate').and.returnValue(routerActivateDefer.promise);
                    routerActivateDefer.resolve();
                });

                describe('and user is anonymous', function () {

                    beforeEach(function () {
                        userContext.identity = null;
                    });

                    it('should set isTryMode to true', function (done) {
                        var promise = viewModel.activate();
                        promise.fin(function () {
                            expect(viewModel.isTryMode).toBeTruthy();
                            done();
                        });
                    });

                    it('should set username to null', function (done) {
                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(viewModel.username).toBeNull();
                            done();
                        });

                    });

                });

                describe('and user is not anonymous', function () {

                    beforeEach(function () {
                        userContext.identity = {};
                    });

                    describe('and user does not have fullname', function () {

                        beforeEach(function () {
                            userContext.identity = {
                                email: 'usermail@easygenerator.com',
                                fullname: ' '
                            };
                        });

                        it('should set email to username', function (done) {
                            var promise = viewModel.activate();

                            promise.fin(function () {
                                expect(viewModel.username).toBe(userContext.identity.email);
                                done();
                            });
                        });

                    });

                    describe('and user has fullname', function () {

                        beforeEach(function () {
                            userContext.identity = { fullname: 'username' };
                        });

                        it('should set fullname to username', function (done) {
                            var promise = viewModel.activate();
                            promise.fin(function () {
                                expect(viewModel.username).toBe(userContext.identity.fullname);
                                done();
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

            it('should be function', function () {
                expect(viewModel.showNavigation).toBeFunction();
            });

            describe('when activeModuleName is error page', function () {

                describe('and error page 400', function () {

                    it('should be return true', function () {
                        spyOn(viewModel, 'activeModuleName').and.returnValue('400');
                        expect(viewModel.showNavigation()).toBeTruthy();
                    });

                });

                describe('and error page 404', function () {

                    it('should be return true', function () {
                        spyOn(viewModel, 'activeModuleName').and.returnValue('404');
                        expect(viewModel.showNavigation()).toBeTruthy();
                    });

                });

            });

            describe('when activeModuleName is not error page', function () {

                it('should be return fasle', function () {
                    spyOn(viewModel, 'activeModuleName').and.returnValue('somepage');
                    expect(viewModel.showNavigation()).toBeFalsy();
                });

            });

        });

    });

});