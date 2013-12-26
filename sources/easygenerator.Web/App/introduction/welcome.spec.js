define(['introduction/welcome'],
    function (viewModel) {
        'use strict';

        var
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            dataContext = require('dataContext'),
            httpWrapper = require('httpWrapper'),
            uiLocker = require('uiLocker');

        describe('viewModel [welcome]', function () {

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            describe('isShowCheckbox', function () {

                it('should be observable', function() {
                    expect(viewModel.isShowCheckbox).toBeObservable();
                });

            });

            describe('isCheckedDoNotShowAgain', function () {

                it('should be observable', function() {
                    expect(viewModel.isCheckedDoNotShowAgain).toBeObservable();
                });

            });

            describe('activate:', function () {

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                describe('when is anonymous user', function () {

                    beforeEach(function () {
                        dataContext.userEmail = '';
                    });

                    it('should hide checkbox \'Do not show again\'', function () {
                        viewModel.isShowCheckbox(false);
                        viewModel.activate();
                        expect(viewModel.isShowCheckbox()).toBeFalsy();
                    });

                });

                describe('when is not anonymous user', function () {

                    beforeEach(function () {
                        dataContext.userEmail = 'user@easygenerator.com';
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

                var defer;

                beforeEach(function () {
                    defer = Q.defer();
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'replace');
                    spyOn(httpWrapper, 'post').andReturn(defer.promise);
                    spyOn(uiLocker, 'lock');
                    spyOn(uiLocker, 'unlock');
                });

                it('should be function', function () {
                    expect(viewModel.startEasygenerator).toBeFunction();
                });

                describe('when is not anonymous user', function () {

                    beforeEach(function () {
                        dataContext.userEmail = 'user@easygenerator.com';
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

                        describe('and when \'Do not show again\' is checked', function () {

                            it('should send event \'Start easygenerator from welcome page and do not show it again\'', function () {
                                viewModel.isCheckedDoNotShowAgain(true);
                                var promise = viewModel.startEasygenerator();
                                defer.resolve();
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(eventTracker.publish).toHaveBeenCalledWith('Start easygenerator from welcome page and do not show it again');
                                });
                            });

                        });

                        describe('and when \'Do not show again\' is unchecked', function () {

                            it('should send event \'Start easygenerator from welcome page and show it again\'', function () {
                                viewModel.isCheckedDoNotShowAgain(false);
                                var promise = viewModel.startEasygenerator();
                                defer.resolve();
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(eventTracker.publish).toHaveBeenCalledWith('Start easygenerator from welcome page and show it again');
                                });
                            });

                        });

                        it('should update isShowIntroduction in dataContext', function () {
                            dataContext.userSettings.isShowIntroduction = true;
                            viewModel.isCheckedDoNotShowAgain(true);
                            var promise = viewModel.startEasygenerator();
                            defer.resolve();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(dataContext.userSettings.isShowIntroduction).toBeFalsy();
                            });
                        });

                        it('should navigate to home page', function () {
                            var promise = viewModel.startEasygenerator();
                            defer.resolve();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(router.replace).toHaveBeenCalledWith('');
                            });
                        });
                        
                        it('should unclock UI', function () {
                            var promise = viewModel.startEasygenerator();
                            defer.resolve();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(uiLocker.unlock).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('and when promise is reject', function () {
                        it('should unclock UI', function () {
                            var promise = viewModel.startEasygenerator();
                            defer.reject();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(uiLocker.unlock).toHaveBeenCalled();
                            });
                        });
                    });

                    

                });

                describe('when is anonymous user', function () {

                    beforeEach(function() {
                        dataContext.userEmail = '';
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

            describe('changeDoNotShowAgain', function() {

                it('should be function', function() {
                    expect(viewModel.changeDoNotShowAgain).toBeFunction();
                });

                it('should checked checkbox if he is not checked', function () {
                    viewModel.isCheckedDoNotShowAgain(false);
                    viewModel.changeDoNotShowAgain();
                    expect(viewModel.isCheckedDoNotShowAgain()).toBeTruthy();
                });

            });

        });

    }
);