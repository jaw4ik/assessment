define(['help/helpHint'], function (viewModel) {
    "use strict";

    var
        localizationManager = require('localization/localizationManager'),
        constants = require('constants'),
        app = require('durandal/app');

    describe('viewModel [helpHint]', function () {

        beforeEach(function() {
            spyOn(app, 'trigger');
        });

        describe('title:', function () {

            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });

        });

        describe('text:', function () {

            it('should be observable', function () {
                expect(viewModel.text).toBeObservable();
            });

        });

        describe('visible:', function () {

            it('should be observable', function () {
                expect(viewModel.visible).toBeObservable();
            });

        });

        describe('isHelpHintExist:', function () {

            it('should be observable', function () {
                expect(viewModel.isHelpHintExist).toBeObservable();
            });

        });

        describe('show:', function () {

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            describe('when help hint exists', function () {

                beforeEach(function () {
                    viewModel.isHelpHintExist(true);
                });

                it('should set visible to true', function () {
                    viewModel.visible(false);
                    viewModel.show();
                    expect(viewModel.visible()).toBeTruthy();
                });

                it('should trigger event \'' + constants.messages.helpHint.shown + '\'', function () {
                    viewModel.show();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.helpHint.shown);
                });

            });

        });

        describe('close:', function () {

            it('should be function', function () {
                expect(viewModel.close).toBeFunction();
            });

            describe('when help hint exists', function () {

                beforeEach(function () {
                    viewModel.isHelpHintExist(true);
                });

                it('should set visible to false', function () {
                    viewModel.visible(true);
                    viewModel.close();
                    expect(viewModel.visible()).toBeFalsy();
                });

                it('should trigger event \'' + constants.messages.helpHint.hidden + '\'', function () {
                    viewModel.close();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.helpHint.hidden);
                });

            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should set visible to false', function () {
                viewModel.visible(true);
                viewModel.activate();
                expect(viewModel.visible()).toBeFalsy();
            });

            describe('when help hint does not have localization keys', function () {

                beforeEach(function () {
                    spyOn(localizationManager, 'hasKey').and.returnValue(false);
                });

                it('should set isHelpHintExist to false', function () {
                    viewModel.isHelpHintExist(true);
                    viewModel.activate();
                    expect(viewModel.isHelpHintExist()).toBeFalsy();
                });

            });

            describe('when help hint has localization keys', function () {

                beforeEach(function () {
                    spyOn(localizationManager, 'hasKey').and.returnValue(true);
                    spyOn(localizationManager, 'localize').and.returnValue('Some text');
                });

                it('should set isHelpHintExist to true', function () {
                    viewModel.isHelpHintExist(false);
                    viewModel.activate();
                    expect(viewModel.isHelpHintExist()).toBeTruthy();
                });

                it('should set help hint title', function () {
                    viewModel.title('title');
                    viewModel.activate();
                    expect(viewModel.title()).toBe('Some text');
                });

                it('should set help hint text', function () {
                    viewModel.text('text');
                    viewModel.activate();
                    expect(viewModel.text()).toBe('Some text');
                });
            });
        });
    });
})