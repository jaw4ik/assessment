define(function (require) {

    var viewModel = require('viewmodels/shell'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        localizationManager = require('localization/localizationManager'),
        helpHintRepository = require('repositories/helpHintRepository');

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

            it('should equal \'experiences\'', function () {
                expect(viewModel.homeModuleName).toEqual('experiences');
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

        });

        describe('userEmail:', function () {

            it('should be defined', function () {
                expect(viewModel.userEmail).toBeDefined();
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

        describe('helpHint:', function () {

            it('should be observable', function () {
                expect(viewModel.helpHint).toBeObservable();
            });

        });

        describe('helpHintText:', function () {

            describe('when helpHint is undefined', function () {

                it('should return empty string', function () {
                    viewModel.helpHint(undefined);
                    expect(viewModel.helpHintText()).toBe('');
                });

            });

            describe('when helpHint defined', function () {

                it('should return localized text', function () {
                    spyOn(localizationManager, 'localize').andReturn('someLocalizedText');
                    viewModel.helpHint({ localizationKey: 'someKey' });

                    var result = viewModel.helpHintText();

                    expect(localizationManager.localize).toHaveBeenCalledWith('someKey');
                    expect(result).toBe('someLocalizedText');
                });

            });

        });

        describe('hideHelpHint:', function () {

            var removeHintDeffer;

            beforeEach(function () {
                removeHintDeffer = Q.defer();
                spyOn(helpHintRepository, 'removeHint').andReturn(removeHintDeffer.promise);
                spyOn(localizationManager, 'localize').andReturn('someLocalizedText');
            });

            it('should be function', function () {
                expect(viewModel.hideHelpHint).toBeFunction();
            });

            describe('when helpHint is undefined', function () {

                it('should not call removeHint in repository', function () {
                    viewModel.helpHint(undefined);

                    viewModel.hideHelpHint();

                    expect(helpHintRepository.removeHint).not.toHaveBeenCalled();
                });

            });

            describe('when help hint is defined', function () {

                it('should call removeHint in repository', function () {
                    var helpHint = { id: 'someId', name: 'someName', localizationKey: 'someLocalizationKey' };
                    viewModel.helpHint(helpHint);
                    var promise = removeHintDeffer.promise.fin(function () { });
                    
                    viewModel.hideHelpHint();
                    removeHintDeffer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(helpHintRepository.removeHint).toHaveBeenCalledWith(helpHint.id);
                    });
                });

                describe('and promise resolved', function () {

                    it('should set help hint to undefined', function () {
                        var helpHint = { id: 'someId', name: 'someName', localizationKey: 'someLocalizationKey' };
                        viewModel.helpHint(helpHint);

                        var promise = removeHintDeffer.promise.fin(function () { });

                        viewModel.hideHelpHint();
                        removeHintDeffer.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.helpHint()).toBe(undefined);
                        });
                    });

                });

            });

        });

        describe('showHelpHint:', function () {

            var addHintDeffer;

            beforeEach(function () {
                addHintDeffer = Q.defer();
                spyOn(helpHintRepository, 'addHint').andReturn(addHintDeffer.promise);
                spyOn(localizationManager, 'localize').andReturn('someLocalizedText');
            });

            it('should be function', function () {
                expect(viewModel.showHelpHint).toBeFunction();
            });


            describe('when helpHint is defined', function () {

                it('should not call addHint in repository', function () {
                    var helpHint = { id: 'someId', name: 'someName', localizationKey: 'someLocalizationKey' };
                    viewModel.helpHint(helpHint);

                    viewModel.showHelpHint();

                    expect(helpHintRepository.addHint).not.toHaveBeenCalled();
                });

            });

            describe('when helpHint is undefined', function () {

                it('should call addHint in repository', function () {
                    var helpHint = { id: 'someId', name: 'someName', localizationKey: 'someLocalizationKey' };
                    viewModel.helpHint(undefined);
                    var promise = addHintDeffer.promise.fin(function () { });

                    viewModel.showHelpHint();
                    addHintDeffer.resolve(helpHint);

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(helpHintRepository.addHint).toHaveBeenCalled();
                    });
                });

                describe('and addHint promise resolved', function () {

                    it('should update helpHint', function() {
                        var helpHint = { id: 'someId', name: 'someName', localizationKey: 'someLocalizationKey' };
                        viewModel.helpHint(undefined);
                        var promise = addHintDeffer.promise.fin(function () { });

                        viewModel.showHelpHint();
                        addHintDeffer.resolve(helpHint);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.helpHint()).toBe(helpHint);
                        });
                    });

                });

            });

        });

        describe('sendFeedback:', function () {

            it('should be function', function() {
                expect(viewModel.sendFeedback).toBeFunction();
            });

            it('should send event \'Feedback\'', function () {
                viewModel.sendFeedback();
                expect(eventTracker.publish).toHaveBeenCalledWith('Feedback');
            });

            it('should set router location', function () {
                viewModel.sendFeedback();
                expect(router.setLocation).toHaveBeenCalledWith("mailto:support@easygenerator.com?subject=Feedback from user");
            });
        });

    });

});