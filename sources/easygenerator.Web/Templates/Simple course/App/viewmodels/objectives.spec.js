define(['viewmodels/objectives'], function (viewModel) {

    var repository = require('repositories/courseRepository'),
        router = require('plugins/router'),
        windowOperations = require('windowOperations');

    describe('viewModel [objectives]', function () {

        var course = {
            calculateScore: function () {
            },
            finish: function () {
            },
            objectives: [{
                id: 'id',
                title: 'titile',
                score: 75
            }]
        };

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('score:', function () {

            it('should be defined', function () {
                expect(viewModel.score).toBeDefined();
            });

        });

        describe('status:', function () {

            it('should be observable', function () {
                expect(viewModel.status).toBeObservable();
            });
        });

        describe('statuses:', function () {

            it('should be defined', function () {
                expect(viewModel.statuses).toBeDefined();
            });

        });

        describe('objectives:', function () {

            it('should be defined', function () {
                expect(viewModel.objectives).toBeDefined();
            });

        });

        describe('activate:', function () {

            beforeEach(function () {
                spyOn(router, 'navigate');
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('and when course is not an object', function () {

                beforeEach(function () {
                    spyOn(repository, 'get').andReturn(null);
                });

                it('should navigate to 404', function () {
                    viewModel.activate();
                    expect(router.navigate).toHaveBeenCalledWith('404');
                });
            });

            describe('and when course is an object', function () {

                beforeEach(function () {
                    spyOn(repository, 'get').andReturn(course);
                });

                it('should call course calculate score', function () {
                    spyOn(course, 'calculateScore');

                    viewModel.activate();
                    expect(course.calculateScore).toHaveBeenCalled();
                });

                it('should set course score', function () {
                    viewModel.score = 0;
                    course.score = 55;

                    viewModel.activate();
                    expect(viewModel.score).toBe(55);
                });

                it('should map objectives collection', function () {
                    viewModel.objectives = [];

                    viewModel.activate();
                    expect(viewModel.objectives.length).toBe(1);
                    expect(viewModel.objectives[0].id).toBe(course.objectives[0].id);
                    expect(viewModel.objectives[0].title).toBe(course.objectives[0].title);
                    expect(viewModel.objectives[0].score).toBe(course.objectives[0].score);
                });
            });

        });

        describe('finish:', function () {

            beforeEach(function () {
                spyOn(repository, 'get').andReturn(course);
            });

            it('should be function', function () {
                expect(viewModel.finish).toBeFunction();
            });

            describe('when status is not ready to finish', function () {

                beforeEach(function () {
                    viewModel.status('notReadyToFinish');
                });

                it('should not change status', function () {
                    viewModel.finish();
                    expect(viewModel.status()).toBe('notReadyToFinish');
                });

                it('should not call course finish', function () {
                    spyOn(course, 'finish');
                    viewModel.finish();
                    expect(course.finish).not.toHaveBeenCalled();
                });

            });

            describe('when status is ready to finish', function() {

                beforeEach(function() {
                    viewModel.status(viewModel.statuses.readyToFinish);
                });

                it('should change status to sending request', function () {
                    viewModel.finish();
                    expect(viewModel.status()).toBe('sendingRequests');
                });

                it('should get course from repository', function () {
                    viewModel.finish();
                    expect(repository.get).toHaveBeenCalled();
                });

                it('should call course finish', function () {
                    spyOn(course, 'finish');
                    viewModel.finish();
                    expect(course.finish).toHaveBeenCalled();
                });

                describe('and course finished', function () {
                    
                    beforeEach(function () {
                        spyOn(windowOperations, 'close');
                        spyOn(course, 'finish').andCallFake(function (callback) {
                            callback();
                        });
                    });

                    it('should change status to fiished', function () {
                        viewModel.finish();
                        expect(viewModel.status()).toBe('finished');
                    });

                    it('should call windows operations close', function () {
                        viewModel.finish();
                        expect(windowOperations.close).toHaveBeenCalled();
                    });

                });

            });

        });

    });

});