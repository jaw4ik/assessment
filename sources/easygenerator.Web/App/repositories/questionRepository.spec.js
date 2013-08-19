define(['repositories/questionRepository', 'repositories/objectiveRepository'],
    function (questionRepository, objectiveRepository) {
        "use strict";

        describe('[questionRepository]', function () {

            describe('create:', function () {
                var getObjectiveDeferred;
                beforeEach(function () {
                    getObjectiveDeferred = Q.defer();
                    spyOn(objectiveRepository, 'getById').andReturn(getObjectiveDeferred.promise);
                });

                describe('when objectiveId is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.add();
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when objectiveId is null', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.add(null);
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when question is null', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.add(1, null);
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when question is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () {
                            questionRepository.add(1);
                        };
                        expect(f).toThrow();
                    });
                });

                it('should return promise', function () {
                    var promise = questionRepository.add(1, { title: 'lalala' });
                    expect(promise).toBePromise();
                });

                describe('when objective does not exist', function () {
                    it('should reject promise', function () {
                        var promise = questionRepository.add(-1, { title: 'lalala' });
                        getObjectiveDeferred.resolve(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('rejected');
                        });
                    });
                });

                describe('when objective exists', function () {
                    var objective = { id: 1, questions: [] };
                    var question = { title: 'lalal' };

                    it('should resolve promise with new question id value', function () {
                        var promise = questionRepository.add(objective.id, question);
                        getObjectiveDeferred.resolve(objective);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('fulfilled');
                            expect(promise.inspect().value).toEqual(0);
                        });
                    });
                });
            });
        });
    });