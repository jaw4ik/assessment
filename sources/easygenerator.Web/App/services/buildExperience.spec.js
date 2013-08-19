define(['services/buildExperience'],
    function (service) {
        "use strict";

        var
            constants = require('constants'),
            repository = require('repositories/experienceRepository'),
            http = require('plugins/http');

        describe('service [buildExperience]', function () {

            describe('build:', function () {

                var getById;

                beforeEach(function () {
                    getById = Q.defer();
                    spyOn(repository, 'getById').andReturn(getById.promise);
                });

                it('should be function', function () {
                    expect(service.build).toEqual(jasmine.any(Function));
                });

                it('should return promise', function () {
                    var promise = service.build();

                    getById.resolve(null);

                    expect(promise).toBePromise();
                });

                describe('when get experience from repository', function () {

                    describe('and experience was not found', function () {

                        it('should reject promise', function () {
                            var promise = service.build();

                            getById.resolve(null);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise.inspect().state).toEqual("rejected");
                            });
                        });

                    });

                    describe('and experience is already building ', function () {

                        it('should reject promise', function () {
                            var promise = service.build();

                            getById.resolve({ buildingStatus: constants.buildingStatuses.inProgress });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise.inspect().state).toEqual("rejected");
                            });
                        });

                    });

                    describe('and promise is not resolved or rejected', function () {

                        it('should change building status to \'inProgress\'', function () {

                            spyOn(http, 'post').andReturn($.Deferred().promise());

                            var experience = { buildingStatus: '' };
                            getById.resolve(experience);

                            service.build();

                            waitsFor(function () {
                                return getById.promise.isFulfilled() && http.post.calls.length == 1;
                            });
                            runs(function () {
                                expect(experience.buildingStatus).toEqual(constants.buildingStatuses.inProgress);
                            });
                        });

                    });

                    it('should send request', function () {
                        var post = $.Deferred();
                        spyOn(http, 'post').andReturn(post.promise());

                        var experience = { buildingStatus: '' };
                        getById.resolve(experience);
                        post.resolve();

                        var promise = service.build();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.post).toHaveBeenCalledWith('experience/build', experience);
                        });
                    });

                    describe('and send request to server', function () {

                        var post;

                        beforeEach(function () {
                            post = $.Deferred();
                            spyOn(http, 'post').andReturn(post.promise());
                        });

                        describe('and request succeed', function () {

                            describe('and response is undefined', function () {

                                it('should reject promise', function () {
                                    var promise = service.build();

                                    getById.resolve({});
                                    post.resolve();

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise.inspect().state).toEqual("rejected");
                                    });
                                });

                            });

                            describe('and response.Success is undefined', function () {

                                it('should reject promise', function () {
                                    var promise = service.build();

                                    getById.resolve({});
                                    post.resolve({});

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise.inspect().state).toEqual("rejected");
                                    });
                                });

                            });

                            describe('and response.Success is true', function () {

                                it('should set experience buildingStatus to \'succeed\'', function () {
                                    var promise = service.build();

                                    var experience = { buildingStatus: '' };

                                    getById.resolve(experience);
                                    post.resolve({ Success: true });

                                    waitsFor(function () {
                                        return promise.isFulfilled();
                                    });
                                    runs(function () {
                                        expect(experience.buildingStatus).toEqual(constants.buildingStatuses.succeed);
                                    });
                                });

                                it('should resolve promise with true', function () {
                                    var promise = service.build();

                                    var experience = { buildingStatus: '' };

                                    getById.resolve(experience);
                                    post.resolve({ Success: true });

                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise.inspect().state).toEqual("fulfilled");
                                        expect(promise.inspect().value).toEqual(true);
                                    });
                                });

                            });
                        });

                        describe('and request failed', function () {

                            it('should set experience buildingStatus to \'failed\'', function () {
                                var promise = service.build();

                                var experience = { buildingStatus: '' };

                                getById.resolve(experience);
                                post.reject();

                                waitsFor(function () {
                                    return promise.isFulfilled();
                                });
                                runs(function () {
                                    expect(experience.buildingStatus).toEqual(constants.buildingStatuses.failed);
                                });
                            });

                            it('should resolve promise with false', function () {
                                var promise = service.build();

                                getById.resolve({});
                                post.reject();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise.inspect().state).toEqual("fulfilled");
                                    expect(promise.inspect().value).toEqual(false);
                                });
                            });

                        });

                    });

                });

            });

        });

    });