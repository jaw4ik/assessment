define(['context', 'repositories/learningContentRepository', 'plugins/http'], function (context, repository, http) {

    describe('repository [learningContentRepository]', function () {

        it('should be defined', function () {
            expect(repository).toBeDefined();
        });

        describe('getCollection:', function () {
            var getDeferred = null;
            beforeEach(function () {
                getDeferred = Q.defer();
                spyOn(http, 'get').andReturn(getDeferred.promise);
                spyOn(Q, 'allSettled').andCallFake(function (requests) {
                    return Q.fcall(function () {
                        _.each(requests, function (request) {
                            request();
                        });
                    });
                });
            });

            it('should be function', function () {
                expect(repository.getCollection).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.getCollection()).toBePromise();
            });

            describe('when objectiveId is not string', function () {

                it('should reject promise with \'Objective id is not a string\'', function () {
                    var promise = repository.getCollection(null, '');

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Objective id is not a string');
                    });
                });

            });

            describe('when objectiveId is a string', function () {

                describe('and when questionId is not string', function () {

                    it('should reject promise with \'Question id is not a string\'', function () {
                        var promise = repository.getCollection('', null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Question id is not a string');
                        });
                    });

                });

                describe('and when questionId is a string', function () {
                    var objectiveId = 'objectiveId';
                    var questionId = 'questionId';

                    describe('and when objective is not found', function () {
                        beforeEach(function () {
                            context.course = {};
                            context.course.objectives = [];
                        });

                        it('should resolve promise with null', function () {
                            var promise = repository.getCollection(objectiveId, questionId);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolvedWith(null);
                            });
                        });
                    });

                    describe('and when objective is found', function () {
                        var objective = { id: objectiveId };
                        beforeEach(function () {
                            context.course = {};
                            context.course.objectives = [objective];
                        });

                        describe('and when question is not found', function () {
                            beforeEach(function () {
                                objective.questions = [];
                                context.course.objectives = [objective];
                            });

                            it('should resolve promise with null', function () {
                                var promise = repository.getCollection(objectiveId, questionId);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(null);
                                });
                            });
                        });

                        describe('and when question is found', function () {
                            var question = { id: questionId, learningContents: [{ id: '0' }] };
                            beforeEach(function () {
                                objective.questions = [question];
                                context.course.objectives = [objective];
                            });

                            it('should load question content', function () {
                                var promise = repository.getCollection(objectiveId, questionId);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(http.get).toHaveBeenCalled();
                                });
                            });
                        });

                    });
                });

            });
        });

    });
});