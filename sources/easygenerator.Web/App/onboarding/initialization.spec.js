define(['onboarding/initialization'], function (viewModel) {
    "use strict";

    var
        apiHttpWrapper = require('http/apiHttpWrapper'),
        constants = require('constants'),
        app = require('durandal/app');

    describe('viewmodel [initialization]', function () {

        var httpPostDefer;
        beforeEach(function () {
            httpPostDefer = Q.defer();
            spyOn(apiHttpWrapper, 'post').and.returnValue(httpPostDefer.promise);

            spyOn(app, 'trigger');
            spyOn(app, 'on');
        });

        describe('getTasksList:', function () {

            it('should be function', function () {
                expect(viewModel.getTasksList).toBeFunction();
            });

        });

        describe('isClosed:', function () {

            it('should be observable', function() {
                expect(viewModel.isClosed).toBeObservable();
            });

        });

        describe('closeOnboarding:', function () {

            it('should be function', function () {
                expect(viewModel.closeOnboarding).toBeFunction();
            });

            it('should call api \'api/onboarding/close\'', function () {
                viewModel.closeOnboarding();
                httpPostDefer.resolve();
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/onboarding/close');
            });

            describe('when request success', function () {

                beforeEach(function () {
                    httpPostDefer.resolve();
                });

                it('should set isClosed to true', function () {
                    viewModel.isClosed(false);
                    viewModel.closeOnboarding().fin(function () {
                        expect(viewModel.isClosed()).toBeTruthy();
                        done();
                    });
                });

                it('should trigger event ' + constants.messages.onboarding.closed, function (done) {
                    viewModel.closeOnboarding().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.onboarding.closed);
                        done();
                    });
                });

            });

        });

        describe('initialize:', function () {

            it('should be function', function () {
                expect(viewModel.initialize).toBeFunction();
            });

            it('should get states', function () {
                httpPostDefer.resolve({});
                viewModel.initialize();
                expect(apiHttpWrapper.post).toHaveBeenCalledWith('api/onboarding');
            });

            it('should set isClosed', function(done) {
                httpPostDefer.resolve({ isClosed: true });
                viewModel.initialize().fin(function () {
                    expect(viewModel.isClosed()).toBeTruthy();
                    done();
                });
            });

            it('should initialize tasksList', function (done) {
                httpPostDefer.resolve({});
                viewModel.initialize().fin(function () {
                    expect(viewModel.getTasksList().length).toBeGreaterThan(0);
                    done();
                });
            });

            describe('when tasks initialized', function() {

                var task;
                beforeEach(function(done) {
                    httpPostDefer.resolve({});
                    viewModel.initialize().fin(function () {
                        task = viewModel.getTasksList()[0];
                        done();
                    });
                });

                describe('task:', function() {
                   
                    describe('isHintVisible:', function () {

                        it('should be observable', function () {
                            expect(task.isHintVisible).toBeObservable();
                        });

                    });

                    describe('showHint:', function () {

                        it('should be function', function () {
                            expect(task.showHint).toBeFunction();
                        });

                        it('should hide all other hints', function () {
                            var tasks = viewModel.getTasksList();
                            tasks[2].isHintVisible(true);
                            tasks[3].isHintVisible(true);

                            task.showHint();

                            expect(tasks[2].isHintVisible()).toBeFalsy();
                            expect(tasks[3].isHintVisible()).toBeFalsy();
                        });

                        it('should set isHintVisible to true', function () {
                            task.isHintVisible(false);
                            task.showHint();
                            expect(task.isHintVisible()).toBeTruthy();
                        });

                    });

                    describe('closeHint:', function () {

                        it('should be function', function () {
                            expect(task.closeHint).toBeFunction();
                        });

                        it('should set isHintVisible to false', function () {
                            task.isHintVisible(true);
                            task.closeHint();
                            expect(task.isHintVisible()).toBeFalsy();
                        });

                    });

                    describe('markedAsNext:', function() {

                        it('should be observable', function() {
                            expect(task.markedAsNext).toBeObservable();
                        });

                    });

                    describe('markAsNext:', function () {

                        it('should be function', function() {
                            expect(task.markAsNext).toBeFunction();
                        });

                        it('should unmark all other tasks', function () {
                            var tasks = viewModel.getTasksList();
                            tasks[2].markedAsNext(true);
                            tasks[3].markedAsNext(true);

                            task.markAsNext();

                            expect(tasks[2].markedAsNext()).toBeFalsy();
                            expect(tasks[3].markedAsNext()).toBeFalsy();
                        });

                        it('should mark current task as next', function() {
                            task.markedAsNext(false);
                            task.markAsNext();
                            expect(task.markedAsNext()).toBeTruthy();
                        });

                    });

                    describe('isCompleted:', function () {

                        it('should be observable', function () {
                            expect(task.isCompleted).toBeObservable();
                        });

                        describe('when isCompleted value was changed to true', function () {

                            it('should show the first uncompleted task hint and mark this task as next', function () {
                                task.isCompleted(false);
                                var tasks = viewModel.getTasksList();

                                tasks[1].isHintVisible(false);
                                tasks[1].markedAsNext(false);

                                task.isCompleted(true);

                                expect(tasks[1].isHintVisible()).toBeTruthy();
                                expect(tasks[1].markedAsNext()).toBeTruthy();
                            });

                        });

                    });

                });

            });

        });

    });

});