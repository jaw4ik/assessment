define(['viewmodels/experiences/experience'],
    function (viewModel) {

        var
            define = require('viewmodels/experiences/define'),
            design = require('viewmodels/experiences/design'),
            deliver = require('viewmodels/experiences/deliver'),
            clientContext = require('clientContext'),
            app = require('durandal/app'),
            notify = require('notify'),
            constants = require('constants')
        ;

        describe('viewModel [experience]', function () {

            var activateItemDeferred = Q.defer();
            beforeEach(function () {
                spyOn(viewModel.activeStep, 'activateItem').andReturn(activateItemDeferred.promise);
                spyOn(notify, 'error');
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

                it('should set experience id', function () {
                    var promise = viewModel.activate('SomeId');
                    activateItemDeferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.id).toEqual('SomeId');
                    });
                });

                describe('and when set active step to define', function () {

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

                    describe('and when active step set successfully', function () {

                        beforeEach(function () {
                            activateItemDeferred.resolve();
                        });

                        it('should set experience id as the last visited in client context', function () {
                            spyOn(clientContext, 'set');
                            var promise = viewModel.activate('SomeId');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(clientContext.set).toHaveBeenCalledWith('lastVistedExperience', 'SomeId');
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

                    });
                });

            });

            describe('deactivate:', function () {

                it('should be function', function () {
                    expect(viewModel.deactivate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.deactivate()).toBePromise();
                });

                it('should set experience id to an empty string', function () {
                    viewModel.id = 'SomeId';
                    var promise = viewModel.deactivate();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.id).toEqual('');
                    });
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

            describe('when current experience build failed', function () {

                var message = "message";

                describe('and when message is defined', function () {
                    it('should show notification', function () {
                        viewModel.id = 'id';
                        notify.error.reset();

                        app.trigger(constants.messages.experience.build.failed, viewModel.id, message);

                        expect(notify.error).toHaveBeenCalledWith(message);
                    });
                });

                describe('and when message is not defined', function () {
                    it('should not show notification', function () {
                        viewModel.id = 'id';
                        notify.error.reset();

                        app.trigger(constants.messages.experience.build.failed, viewModel.id);

                        expect(notify.error).not.toHaveBeenCalled();
                    });
                });

            });

            describe('when any other experience build failed', function () {

                it('should not show notification', function () {
                    viewModel.id = 'id';
                    notify.error.reset();

                    app.trigger(constants.messages.experience.build.failed, '100500');

                    expect(notify.error).not.toHaveBeenCalled();
                });

            });

            describe('when current experience publish failed', function () {

                var message = "message";

                describe('and when message is defined', function () {
                    it('should show notification', function () {
                        viewModel.id = 'id';
                        notify.error.reset();

                        app.trigger(constants.messages.experience.publish.failed, viewModel.id, message);

                        expect(notify.error).toHaveBeenCalledWith(message);
                    });
                });

                describe('and when message is not defined', function () {
                    it('should not show notification', function () {
                        viewModel.id = 'id';
                        notify.error.reset();

                        app.trigger(constants.messages.experience.publish.failed, viewModel.id);

                        expect(notify.error).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when any other experience build failed', function () {

                it('should not show notification', function () {
                    viewModel.id = 'id';
                    notify.error.reset();

                    app.trigger(constants.messages.experience.publish.failed, '100500');

                    expect(notify.error).not.toHaveBeenCalled();
                });

            });
        });

    }
);