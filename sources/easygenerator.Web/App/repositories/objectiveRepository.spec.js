define(['repositories/objectiveRepository'],
    function (objectiveRepository) {
        "use strict";

        var
           http = require('plugins/http');

        describe('repository [objectiveRepository]', function () {

            var post;

            beforeEach(function () {
                post = $.Deferred();
                spyOn(http, 'post').andReturn(post.promise());            
            });

            it('should be object', function () {
                expect(objectiveRepository).toBeObject();
            });

            describe('addObjective:', function () {

                it('should be function', function () {
                    expect(objectiveRepository.addObjective).toBeFunction();
                });

                it('should return promise', function () {
                    expect(objectiveRepository.addObjective()).toBePromise();
                });

                describe('when objective data is undefined', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.addObjective();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual("rejected");
                        });
                    });

                });

                describe('when objective data is null', function () {

                    it('should reject promise', function () {
                        var promise = objectiveRepository.addObjective(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual("rejected");
                        });
                    });

                });

                describe('when objective data is an object', function () {

                    it('should send request to server to /objective/create', function () {
                        var objective = {};
                        var promise = objectiveRepository.addObjective(objective);

                        post.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).toHaveBeenCalledWith('objective/create', objective);
                        });
                    });

                    describe('and send request to server', function () {

                        describe('and request failed', function () {

                            it('should reject promise', function () {
                                var promise = objectiveRepository.addObjective({});

                                post.reject();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejected();
                                });
                            });

                        });

                        describe('and request succeed', function () {

                            describe('and response is undefined', function () {

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.addObjective({});

                                    post.resolve();

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejected();
                                    });
                                });

                            });

                            describe('and response is null', function () {

                                it('should reject promise', function () {
                                    var promise = objectiveRepository.addObjective({});

                                    post.resolve(null);

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeRejected();
                                    });
                                });

                            });

                            describe('and response is an object', function () {

                                describe('and response is not successful', function () {

                                    beforeEach(function () {
                                        post.resolve({});
                                    });

                                    it('should reject promise', function () {
                                        var promise = objectiveRepository.addObjective({});

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejected();
                                        });
                                    });

                                });

                                describe('and response is successful', function () {

                                    describe('and objective id is undefined', function () {

                                        beforeEach(function () {
                                            post.resolve({ isSuccessful: true });
                                        });

                                        it('should reject promise', function () {
                                            var promise = objectiveRepository.addObjective({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejected();
                                            });
                                        });

                                    });

                                    describe('and objective id is null', function () {

                                        beforeEach(function () {
                                            post.resolve({ isSuccessful: true, objectiveId: null });
                                        });

                                        it('should reject promise', function () {
                                            var promise = objectiveRepository.addObjective({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejected();
                                            });
                                        });

                                    });

                                    describe('and objective id is a string', function () {

                                        var objectiveId = 'objectiveId';
                                        var objectiveTitle = 'objectiveTitle';

                                        beforeEach(function () {
                                            post.resolve({ isSuccessful: true, objectiveId: objectiveId });
                                        });

                                        it('should resolve promise with objective id', function () {
                                            var promise = objectiveRepository.addObjective({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolvedWith(objectiveId);
                                            });
                                        });

                                        it('should add objective to dataContext', function () {
                                            var dataContext = require('dataContext');
                                            dataContext.objectives.length = 0;

                                            var promise = objectiveRepository.addObjective({ title: objectiveTitle });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(dataContext.objectives.length).toEqual(1);
                                                expect(dataContext.objectives[0]).toEqual({
                                                    id: objectiveId,
                                                    title: objectiveTitle,
                                                    questions: []
                                                });
                                            });
                                        });

                                    });

                                });

                            });

                        });

                    });

                });

            });

            describe('getCollection', function () {

                it('should return promise', function () {
                    var promise = objectiveRepository.getCollection();
                    expect(promise).toBePromise();
                });

            });

            describe("update", function() {
                var getObjectiveDeferred;
                beforeEach(function () {
                    getObjectiveDeferred = Q.defer();
                    spyOn(objectiveRepository, 'getById').andReturn(getObjectiveDeferred.promise);
                });

                it('should return promise', function () {
                    var promise = objectiveRepository.update({ id: 0, title: 'test title' });
                    expect(promise).toBePromise();
                });
            });

        });

    });