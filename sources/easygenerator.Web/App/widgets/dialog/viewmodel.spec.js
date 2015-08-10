//define(['widgets/dialog/dialog'], function (viewModel) {

//    describe('widget [dialog]', function () {

//        beforeEach(function () {

//        });

//        describe('isShown:', function () {
//            it('should be observable', function () {
//                expect(viewModel.isShown).toBeObservable();
//            });
//        });

//        describe('steps:', function () {
//            it('should be observable array', function () {
//                expect(viewModel.steps).toBeObservableArray();
//            });
//        });

//        describe('activeStep:', function () {
//            it('should be observable', function () {
//                expect(viewModel.dialog).toBeObservable();
//            });
//        });

//        describe('settings:', function () {
//            it('should be observable', function () {
//                expect(viewModel.settings).toBeObservable();
//            });
//        });

//        describe('close:', function () {
//            it('should set isShown to false', function () {
//                viewModel.isShown(true);
//                viewModel.close();
//                expect(viewModel.isShown).toBeFalsy();
//            });

//            it('should set activeStep to null', function () {
//                viewModel.dialog({});
//                viewModel.close();
//                expect(viewModel.dialog()).toBeNull();
//            });

//            describe('if active step has closed() function', function () {
//                var activeStep = {
//                    closed: function () { }
//                }

//                it('should call activeStep closed function', function () {
//                    spyOn(activeStep, 'closed');
//                    viewModel.dialog(activeStep);
//                    viewModel.close();
//                    expect(viewModel.dialog().closed).toHaveBeenCalled();
//                });
//            });
//        });

//        describe('hide:', function () {
//            it('should set isShown to false', function () {
//                viewModel.isShown(true);
//                viewModel.hide();
//                expect(viewModel.isShown).toBeFalsy();
//            });

//            it('should set activeStep to null', function () {
//                viewModel.dialog({});
//                viewModel.hide();
//                expect(viewModel.dialog()).toBeNull();
//            });
//        });

//        describe('navigate:', function () {
//            var step = { name: 'some step' };

//            describe('when step is activeStep', function () {
//                beforeEach(function () {
//                    viewModel.dialog(step);
//                });

//                it('should not change active step', function () {
//                    viewModel.navigate(step);
//                    expect(viewModel.dialog()).toBe(step);
//                });
//            });

//            describe('when step is not activeStep', function () {
//                beforeEach(function () {
//                    viewModel.dialog(null);
//                });

//                it('should set step as activeStep', function () {
//                    viewModel.navigate(step);
//                    expect(viewModel.dialog()).toBe(step);
//                });
//            });

//        });

//        describe('navigateToNextStep:', function () {
//            var steps = [{ name: 'step1' }, { name: 'step2' }];

//            describe('when activeStep is a last one in collection', function () {
//                beforeEach(function () {
//                    viewModel.steps(steps);
//                    viewModel.dialog(steps[1]);
//                });

//                it('should not change activeStep', function () {
//                    viewModel.navigateToNextStep();
//                    expect(viewModel.dialog()).toBe(steps[1]);
//                });
//            });

//            describe('when activeStep has next step', function () {
//                beforeEach(function () {
//                    viewModel.steps(steps);
//                    viewModel.dialog(steps[0]);
//                });

//                it('should set activeStep to next step', function () {
//                    viewModel.navigateToNextStep();
//                    expect(viewModel.dialog()).toBe(steps[1]);
//                });
//            });
//        });

//        describe('show:', function () {
//            var steps = [{ name: 'step1' }, { name: 'step2' }],
//                settings = {
//                    containerCss: 'container'
//                }
//            it('should set isShown to true', function () {
//                viewModel.isShown(false);
//                viewModel.show(steps);
//                expect(viewModel.isShown()).toBeTruthy();
//            });

//            describe('when settings are not defined', function () {
//                it('should set settings to defaule value', function () {
//                    viewModel.settings(null);
//                    viewModel.show(steps);
//                    expect(viewModel.settings()).toBeDefined();
//                    expect(viewModel.settings().autoclose).toBeFalsy();
//                    expect(viewModel.settings().containerCss).toBe('');
//                });
//            });

//            describe('when settings are defined', function () {
//                it('should set settings', function () {
//                    viewModel.settings(null);
//                    viewModel.show(steps, settings);
//                    expect(viewModel.settings()).toBeDefined();
//                    expect(viewModel.settings().autoclose).toBeFalsy();
//                    expect(viewModel.settings().containerCss).toBe(settings.containerCss);
//                });
//            });

//            describe('when steps is object', function () {
//                it('should push steps', function () {
//                    viewModel.steps([]);
//                    viewModel.show(steps[0], settings);
//                    expect(viewModel.steps[0]).toBe(steps[0]);
//                });
//            });

//            describe('when steps is an array', function () {
//                it('should push steps', function () {
//                    viewModel.steps([]);
//                    viewModel.show(steps, settings);
//                    expect(viewModel.steps[0]).toBe(steps[0]);
//                    expect(viewModel.steps[1]).toBe(steps[1]);
//                });
//            });
//        });
//    });

//});