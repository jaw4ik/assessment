﻿define(['widgets/dialogWizard/viewmodel'], function (viewModel) {
    "use strict";

    var constants = require('constants'),
        activator = require('durandal/activator');

    describe('widget [dialogWizard]', function () {
        describe('isShown:', function () {
            it('should be observable', function () {
                expect(viewModel.isShown).toBeObservable();
            });
        });

        describe('steps:', function () {
            it('should be observable array', function () {
                expect(viewModel.steps).toBeObservableArray();
            });
        });

        describe('activeStep:', function () {
            it('should be observable', function () {
                expect(viewModel.activeStep).toBeObservable();
            });
        });

        describe('settings:', function () {
            it('should be observable', function () {
                expect(viewModel.settings).toBeObservable();
            });
        });

        describe('closed:', function () {
            var dialogActivator = { deactivateItem: function () { } };
            beforeEach(function () {
                spyOn(dialogActivator, 'deactivateItem');
                spyOn(activator, 'create').and.returnValue(dialogActivator);
                viewModel.trigger = function () { };
                spyOn(viewModel, 'trigger');

            });

            it('should trigger dialogClosed event', function () {
                viewModel.closed();
                expect(viewModel.trigger).toHaveBeenCalledWith(constants.dialogs.dialogClosed);
            });

            it('should set activeStep to null', function () {
                viewModel.activeStep({});
                viewModel.closed();
                expect(viewModel.activeStep()).toBeNull();
            });

            it('should deactivate steps', function () {
                var steps = [{ name: 'step1' }, { name: 'step2' }];
                viewModel.steps(steps);
                viewModel.closed();
                expect(dialogActivator.deactivateItem).toHaveBeenCalledWith(steps[0]);
                expect(dialogActivator.deactivateItem).toHaveBeenCalledWith(steps[1]);
            });
        });

        describe('close:', function () {
            it('should set isShown to false', function () {
                viewModel.isShown(true);
                viewModel.close();
                expect(viewModel.isShown()).toBeFalsy();
            });
        });

        describe('navigate:', function () {
            var step = { name: 'some step' };

            describe('when step is activeStep', function () {
                beforeEach(function () {
                    viewModel.activeStep(step);
                });

                it('should not change active step', function () {
                    viewModel.navigate(step);
                    expect(viewModel.activeStep()).toBe(step);
                });
            });

            describe('when step is not activeStep', function () {
                beforeEach(function () {
                    viewModel.activeStep(null);
                });

                it('should set step as activeStep', function () {
                    viewModel.navigate(step);
                    expect(viewModel.activeStep()).toBe(step);
                });
            });

        });

        describe('navigateToNextStep:', function () {
            var steps = [{ name: 'step1' }, { name: 'step2' }];

            describe('when activeStep is a last one in collection', function () {
                beforeEach(function () {
                    viewModel.steps(steps);
                    viewModel.activeStep(steps[1]);
                });

                it('should not change activeStep', function () {
                    viewModel.navigateToNextStep();
                    expect(viewModel.activeStep()).toBe(steps[1]);
                });
            });

            describe('when activeStep has next step', function () {
                beforeEach(function () {
                    viewModel.steps(steps);
                    viewModel.activeStep(steps[0]);
                });

                it('should set activeStep to next step', function () {
                    viewModel.navigateToNextStep();
                    expect(viewModel.activeStep()).toBe(steps[1]);
                });
            });
        });

        describe('show:', function () {
            var steps = [{ name: 'step1' }, { name: 'step2' }],
                settings = {
                    containerCss: 'container'
                }

            it('should push steps', function () {
                viewModel.steps([]);
                viewModel.show(steps, settings);
                expect(viewModel.steps()[0]).toBe(steps[0]);
                expect(viewModel.steps()[1]).toBe(steps[1]);
            });

            it('should set isShown to true', function () {
                viewModel.isShown(false);
                viewModel.show(steps);
                expect(viewModel.isShown()).toBeTruthy();
            });

            it('should set activeStep', function () {
                viewModel.activeStep(null);
                viewModel.show(steps);
                expect(viewModel.activeStep()).toBe(steps[0]);
            });

            describe('when settings are not defined', function () {
                it('should set settings to defaule value', function () {
                    viewModel.settings(null);
                    viewModel.show(steps);
                    expect(viewModel.settings()).toBeDefined();
                    expect(viewModel.settings().autoclose).toBeFalsy();
                    expect(viewModel.settings().containerCss).toBe('');
                });
            });

            describe('when settings are defined', function () {
                it('should set settings', function () {
                    viewModel.settings(null);
                    viewModel.show(steps, settings);
                    expect(viewModel.settings()).toBeDefined();
                    expect(viewModel.settings().autoclose).toBeFalsy();
                    expect(viewModel.settings().containerCss).toBe(settings.containerCss);
                });
            });

        });
    });

});