define(['repositories/objectiveRepository'],
    function (objectiveRepository) {
        "use strict";

        var
           constants = require('constants'),
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

                    it('should send request to server to api/objective/create', function () {
                        var objective = {};
                        var promise = objectiveRepository.addObjective(objective);

                        post.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).toHaveBeenCalledWith('api/objective/create', objective);
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

                                    describe('and response data is undefined', function () {

                                        beforeEach(function () {
                                            post.resolve({ success: true });
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

                                    describe('and response data is null', function () {

                                        beforeEach(function () {
                                            post.resolve({ success: true, data: null });
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

                                    describe('and response is an object', function () {

                                        var objectiveTitle = 'objectiveTitle';
                                        var response = {
                                            Id: 'objectiveId',
                                            CreatedOn: "/Date(1378106938845)/"
                                        };

                                        beforeEach(function () {
                                            post.resolve({ success: true, data: response });
                                        });

                                        it('should resolve promise with response object', function () {
                                            var promise = objectiveRepository.addObjective({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolvedWith(response.Id);
                                            });
                                        });

                                        it('should add objective to dataContext', function () {
                                            var dataContext = require('dataContext');
                                            dataContext.objectives = [];
                                            var date = new Date(parseInt(response.CreatedOn.substr(6), 10));

                                            var promise = objectiveRepository.addObjective({ title: objectiveTitle });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(dataContext.objectives.length).toEqual(1);
                                                expect(dataContext.objectives[0]).toEqual({
                                                    id: response.Id,
                                                    title: objectiveTitle,
                                                    image: constants.defaultObjectiveImage,
                                                    createdOn: date,
                                                    modifiedOn: date,
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

            describe('getCollection:', function () {

                it('should return promise', function () {
                    var promise = objectiveRepository.getCollection();
                    expect(promise).toBePromise();
                });

            });

            describe("update:", function () {
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

            describe('removeObjective:', function () {

                describe('when invalid arguments', function () {

                    describe('and when id is undefined', function () {
                        it('should throw exception', function () {
                            var f = function () {
                                objectiveRepository.removeObjective(undefined);
                            };
                            expect(f).toThrow();
                        });
                    });

                    describe('and when id is null', function () {
                        it('should throw exception', function () {
                            var f = function () {
                                objectiveRepository.removeObjective(null);
                            };
                            expect(f).toThrow();
                        });
                    });

                });

                describe('when valid arguments', function () {

                    it('should return promise', function () {
                        var result = objectiveRepository.removeObjective(-1);
                        expect(result).toBePromise();
                    });

                    describe('when get objective', function () {

                        var getObjectiveDeferred;
                        beforeEach(function () {
                            getObjectiveDeferred = Q.defer();
                            spyOn(objectiveRepository, 'getById').andReturn(getObjectiveDeferred.promise);
                        });

                        describe('and when objective does not exist', function () {
                            it('should reject promise', function () {
                                var promise = objectiveRepository.removeObjective(-1);
                                getObjectiveDeferred.resolve(null);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejected();
                                });
                            });
                        });

                        describe('and when objective exists', function () {
                            it('should resolve promise', function () {
                                var promise = objectiveRepository.removeObjective(-1);
                                getObjectiveDeferred.resolve({ id: 0 });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                });
                            });
                        });

                    });

                });
            });

        });

    }
);