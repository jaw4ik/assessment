define(['introduction/welcome'], function (viewModel) {
    'use strict';

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        dataContext = require('dataContext'),
        userContext = require('userContext'),
        httpWrapper = require('httpWrapper'),
        uiLocker = require('uiLocker');

    describe('viewModel [welcome]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('isShowCheckbox', function () {

            it('should be observable', function () {
                expect(viewModel.isShowCheckbox).toBeObservable();
            });

        });

        describe('isCheckedDoNotShowAgain', function () {

            it('should be observable', function () {
                expect(viewModel.isCheckedDoNotShowAgain).toBeObservable();
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when is anonymous user', function () {

                beforeEach(function () {
                    userContext.identity = null;
                });

                it('should hide checkbox \'Do not show again\'', function () {
                    viewModel.isShowCheckbox(false);
                    viewModel.activate();
                    expect(viewModel.isShowCheckbox()).toBeFalsy();
                });

            });

            describe('when is not anonymous user', function () {

                beforeEach(function () {
                    userContext.identity = {};
                });

                it('should show checkbox \'Do not show again\'', function () {
                    viewModel.isShowCheckbox(false);
                    viewModel.activate();
                    expect(viewModel.isShowCheckbox()).toBeTruthy();
                });

                describe('when user has previously chosen checkbox', function () {

                    it('should checked \'Do not show again\'', function () {
                        dataContext.userSettings.isShowIntroduction = false;
                        viewModel.isCheckedDoNotShowAgain(false);
                        viewModel.activate();
                        expect(viewModel.isCheckedDoNotShowAgain()).toBeTruthy();
                    });

                });

            });

        });

        describe('startEasygenerator:', function () {

            var httpPostDefer;

            beforeEach(function () {
                httpPostDefer = Q.defer();
                spyOn(eventTracker, 'publish');
                spyOn(router, 'replace');
                spyOn(httpWrapper, 'post').and.returnValue(httpPostDefer.promise);
                spyOn(uiLocker, 'lock');
                spyOn(uiLocker, 'unlock');
            });

            it('should be function', function () {
                expect(viewModel.startEasygenerator).toBeFunction();
            });

            describe('when is not anonymous user', function () {

                beforeEach(function () {
                    userContext.identity = {};
                });

                it('should return promise', function () {
                    var promise = viewModel.startEasygenerator();
                    expect(promise).toBePromise();
                });

                describe('and when promise is resolved', function () {

                    it('should lock UI', function () {
                        viewModel.startEasygenerator();
                        expect(uiLocker.lock).toHaveBeenCalled();
                    });

                    it('should update isShowIntroduction in dataContext', function (done) {
                        dataContext.userSettings.isShowIntroduction = true;
                        viewModel.isCheckedDoNotShowAgain(true);
                        var promise = viewModel.startEasygenerator();
                        promise.fin(function () {
                            expect(dataContext.userSettings.isShowIntroduction).toBeFalsy();
                            done();
                        });

                        httpPostDefer.resolve();
                    });

                    it('should navigate to home page', function (done) {
                        var promise = viewModel.startEasygenerator();
                        promise.fin(function () {
                            expect(router.replace).toHaveBeenCalledWith('');
                            done();
                        });

                        httpPostDefer.resolve();
                    });

                    it('should unclock UI', function (done) {
                        var promise = viewModel.startEasygenerator();
                        promise.fin(function () {
                            expect(uiLocker.unlock).toHaveBeenCalled();
                            done();
                        });

                        httpPostDefer.resolve();
                    });

                    describe('and when \'Do not show again\' is checked', function () {

                        it('should send event \'Start easygenerator from welcome page and do not show it again\'', function (done) {
                            viewModel.isCheckedDoNotShowAgain(true);
                            var promise = viewModel.startEasygenerator();
                            promise.fin(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Start easygenerator from welcome page and do not show it again');
                                done();
                            });

                            httpPostDefer.resolve();
                        });

                    });

                    describe('and when \'Do not show again\' is unchecked', function () {

                        it('should send event \'Start easygenerator from welcome page and show it again\'', function (done) {
                            viewModel.isCheckedDoNotShowAgain(false);
                            var promise = viewModel.startEasygenerator();
                            promise.fin(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Start easygenerator from welcome page and show it again');
                                done();
                            });

                            httpPostDefer.resolve();
                        });

                    });


                });

                describe('and when promise is reject', function () {

                    it('should unclock UI', function (done) {
                        var promise = viewModel.startEasygenerator();
                        promise.fin(function () {
                            expect(uiLocker.unlock).toHaveBeenCalled();
                            done();
                        });

                        httpPostDefer.reject('some reason');
                    });

                });

            });

            describe('when is anonymous user', function () {

                beforeEach(function () {
                    userContext.identity = null;
                });

                it('should send event \'Start easygenerator from welcome page\'', function () {
                    viewModel.startEasygenerator();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Start easygenerator from welcome page');
                });

                it('should navigate to home page', function () {
                    viewModel.startEasygenerator();

                    expect(router.replace).toHaveBeenCalledWith('');
                });

            });

        });

        describe('changeDoNotShowAgain', function () {

            it('should be function', function () {
                expect(viewModel.changeDoNotShowAgain).toBeFunction();
            });

            it('should checked checkbox if he is not checked', function () {
                viewModel.isCheckedDoNotShowAgain(false);
                viewModel.changeDoNotShowAgain();

                expect(viewModel.isCheckedDoNotShowAgain()).toBeTruthy();
            });

        });

    });

});