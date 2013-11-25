define(['./activityProvider'],
    function (viewModel) {
        "use strict";

        var eventmanager = require('eventManager'),
            xApiSettings = require('xApi/configuration/xApiSettings'),
            errorsHandler = require('xApi/errorsHandler'),
            constants = require('xApi/constants');

        describe('viewModel [activityProvider]', function () {

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            describe('init:', function () {
                var actorData, activityName, activityUrl;

                beforeEach(function () {
                    actorData = {
                        name: 'Some actor'
                    };
                    activityName = 'Experience';
                    activityUrl = 'http://localhost:666/template/freaestyle learning/#';
                });

                it('should be function', function () {
                    expect(viewModel.init).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.init()).toBePromise();
                });

                var eventMangerDefer,
                    promise;

                beforeEach(function () {
                    eventMangerDefer = Q.defer();
                    spyOn(eventmanager, 'subscribeForEvent').andReturn(eventMangerDefer.promise);
                    promise = viewModel.init(actorData, activityName, activityUrl);
                    xApiSettings.scoresDistribution.minScoreForPositiveResult = 1;
                    xApiSettings.scoresDistribution.positiveVerb = constants.verbs.passed;
                });

                describe('when not enough data in xApiSettings', function () {

                    it('should throw exception if minimum score of positive result equals \'undefined\'', function () {
                        xApiSettings.scoresDistribution.minScoreForPositiveResult = undefined;
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(errorsHandler.errors.notEnoughDataInSettings);
                        });
                    });

                    it('should throw exception if positiveVerb equals \'undefined\'', function () {
                        xApiSettings.scoresDistribution.positiveVerb = undefined;
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(errorsHandler.errors.notEnoughDataInSettings);
                        });
                    });

                });

                describe('when enough data in xApiSettings', function () {

                    it('should subscribe event courseFinished', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventmanager.subscribeForEvent).toHaveBeenCalledWith(eventmanager.events.courseFinished);
                        });
                    });

                    it('should subscribe event courseStarted', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventmanager.subscribeForEvent).toHaveBeenCalledWith(eventmanager.events.courseStarted);
                        });
                    });

                    it('should subscribe event questionSubmitted', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventmanager.subscribeForEvent).toHaveBeenCalledWith(eventmanager.events.questionSubmitted);
                        });
                    });

                    it('should subscribe event learningContentExperienced', function () {
                        waitsFor(function () {
                            return promise.inspect().state != 'pending';
                        });
                        runs(function () {
                            expect(eventmanager.subscribeForEvent).toHaveBeenCalledWith(eventmanager.events.learningContentExperienced);
                        });
                    });

                });


            });

            describe('createActor:', function () {

                it('should be function', function () {
                    expect(viewModel.createActor).toBeFunction();
                });

                it('should return Actor', function () {
                    var result = viewModel.createActor('SomeName', 'fake@gmail.com');

                    expect(result.name).toBe('SomeName');
                    expect(result.mbox).toBe('mailto:fake@gmail.com');
                });

            });

        });

    }
);