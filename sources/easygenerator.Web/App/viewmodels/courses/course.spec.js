﻿define(['viewmodels/courses/course'],
    function (viewModel) {

        var
            define = require('viewmodels/courses/define'),
            design = require('viewmodels/courses/design'),
            deliver = require('viewmodels/courses/deliver'),
            clientContext = require('clientContext'),
            app = require('durandal/app'),
            notify = require('notify'),
            constants = require('constants'),
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            localizationManager = require('localization/localizationManager');

        describe('viewModel [course]', function () {

            var activateItemDeferred = Q.defer();
            beforeEach(function () {
                spyOn(viewModel.activeStep, 'activateItem').andReturn(activateItemDeferred.promise);
                spyOn(notify, 'error');
                spyOn(router, 'navigate');
            });

            it('should be an object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activeStep:', function () {

                it('should be observable', function () {
                    expect(viewModel.activeStep).toBeObservable();
                });

            });

            describe('activate:', function () {
                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.activate('SomeId')).toBePromise();
                });

                it('should set course id', function () {
                    var promise = viewModel.activate('SomeId');
                    activateItemDeferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.id).toEqual('SomeId');
                    });
                });

                it('should set goBackTooltip', function () {
                    spyOn(localizationManager, 'localize').andReturn('text');

                    var promise = viewModel.activate('SomeId');
                    activateItemDeferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.goBackTooltip).toEqual('text text');
                    });
                });

                describe('when set active step to define', function () {

                    it('should reset active step to define', function () {
                        var promise = viewModel.activate('SomeId');
                        activateItemDeferred.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.activeStep.activateItem).toHaveBeenCalledWith(define, 'SomeId');
                        });
                    });

                    describe('and when define step was set successfully', function () {
                        var goToDefineDeferred = Q.defer();
                        
                        beforeEach(function () {
                            spyOn(viewModel, 'goToDefine').andReturn(goToDefineDeferred.promise);
                            goToDefineDeferred.resolve(true);
                        });

                        it('should set course id as the last visited in client context', function () {
                            spyOn(clientContext, 'set');
                            var promise = viewModel.activate('SomeId');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(clientContext.set).toHaveBeenCalledWith('lastVistedCourse', 'SomeId');
                            });
                        });

                        it('should reset last visited objective in client context', function () {
                            spyOn(clientContext, 'set');
                            var promise = viewModel.activate('SomeId');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', null);
                            });
                        });

                        it('should resolve promise', function() {
                            var promise = viewModel.activate('SomeId');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                            });
                        });
                    });
                    
                    describe('and when define step was not set successfully', function () {
                        var goToDefineDeferred = Q.defer();
                        
                        beforeEach(function () {
                            spyOn(viewModel, 'goToDefine').andReturn(goToDefineDeferred.promise);
                            goToDefineDeferred.resolve(false);
                        });

                        it('should not set course id as the last visited in client context', function () {
                            spyOn(clientContext, 'set');
                            var promise = viewModel.activate('SomeId');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(clientContext.set).not.toHaveBeenCalledWith('lastVistedCourse', 'SomeId');
                            });
                        });

                        it('should not reset last visited objective in client context', function () {
                            spyOn(clientContext, 'set');
                            var promise = viewModel.activate('SomeId');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(clientContext.set).not.toHaveBeenCalledWith('lastVisitedObjective', null);
                            });
                        });

                        it('should reject promise with \'Define step was not activated\'', function () {
                            var promise = viewModel.activate('SomeId');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Define step was not activated');
                            });
                        });
                    });
                });

            });

            describe('deactivate:', function () {

                beforeEach(function () {
                    spyOn(viewModel.activeStep, 'deactivate');
                });

                it('should be function', function () {
                    expect(viewModel.deactivate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.deactivate()).toBePromise();
                });

                it('should set course id to an empty string', function () {
                    viewModel.id = 'SomeId';
                    var promise = viewModel.deactivate();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.id).toEqual('');
                    });
                });

                it('should deactivate current active step', function () {
                    viewModel.activeStep._latestValue = design;
                    var promise = viewModel.deactivate();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.activeStep.deactivate).toHaveBeenCalled();
                    });
                });

            });

            describe('goBackTooltip:', function () {
                it('should be defined', function () {
                    expect(viewModel.goBackTooltip).toBeDefined();
                });
            });

            describe('navigateToCourses:', function () {

                beforeEach(function() {
                    spyOn(eventTracker, 'publish');
                });

                it('should be function', function () {
                    expect(viewModel.navigateToCourses).toBeFunction();
                });

                it('should send event \'Navigate to courses\'', function () {
                    viewModel.navigateToCourses();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
                });

                it('should navigate to #courses', function () {
                    viewModel.navigateToCourses();
                    expect(router.navigate).toHaveBeenCalledWith('courses');
                });

            });

            describe('goToDefine:', function () {

                it('should be function', function () {
                    expect(viewModel.goToDefine).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.goToDefine()).toBePromise();
                });

                it('should set activeStep to define', function () {
                    viewModel.goToDefine();
                    expect(viewModel.activeStep.activateItem).toHaveBeenCalledWith(define, jasmine.any(String));
                });

            });

            describe('goToDesign:', function () {

                it('should be function', function () {
                    expect(viewModel.goToDesign).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.goToDesign()).toBePromise();
                });

                it('should set activeStep to desing', function () {
                    viewModel.goToDesign();
                    expect(viewModel.activeStep.activateItem).toHaveBeenCalledWith(design, jasmine.any(String));
                });

            });

            describe('goToDeliver:', function () {

                it('should be function', function () {
                    expect(viewModel.goToDeliver).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.goToDeliver()).toBePromise();
                });

                it('should set activeStep to deliver', function () {
                    viewModel.goToDeliver();
                    expect(viewModel.activeStep.activateItem).toHaveBeenCalledWith(deliver, jasmine.any(String));
                });
            });

            describe('when current course build failed', function () {

                var message = "message";

                describe('and when message is defined', function () {
                    it('should show notification', function () {
                        viewModel.id = 'id';
                        notify.error.reset();

                        app.trigger(constants.messages.course.build.failed, viewModel.id, message);

                        expect(notify.error).toHaveBeenCalledWith(message);
                    });
                });

                describe('and when message is not defined', function () {
                    it('should not show notification', function () {
                        viewModel.id = 'id';
                        notify.error.reset();

                        app.trigger(constants.messages.course.build.failed, viewModel.id);

                        expect(notify.error).not.toHaveBeenCalled();
                    });
                });

            });

            describe('when any other course build failed', function () {

                it('should not show notification', function () {
                    viewModel.id = 'id';
                    notify.error.reset();

                    app.trigger(constants.messages.course.build.failed, '100500');

                    expect(notify.error).not.toHaveBeenCalled();
                });

            });

            describe('when current course publish failed', function () {

                var message = "message";

                describe('and when message is defined', function () {
                    it('should show notification', function () {
                        viewModel.id = 'id';
                        notify.error.reset();

                        app.trigger(constants.messages.course.publish.failed, viewModel.id, message);

                        expect(notify.error).toHaveBeenCalledWith(message);
                    });
                });

                describe('and when message is not defined', function () {
                    it('should not show notification', function () {
                        viewModel.id = 'id';
                        notify.error.reset();

                        app.trigger(constants.messages.course.publish.failed, viewModel.id);

                        expect(notify.error).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when any other course build failed', function () {

                it('should not show notification', function () {
                    viewModel.id = 'id';
                    notify.error.reset();

                    app.trigger(constants.messages.course.publish.failed, '100500');

                    expect(notify.error).not.toHaveBeenCalled();
                });

            });
        });

    }
);