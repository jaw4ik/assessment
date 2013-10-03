define(['services/buildExperience'],
    function (service) {
        "use strict";

        var
            constants = require('constants'),
            repository = require('repositories/experienceRepository'),
            templateRepository = require('repositories/templateRepository'),
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

                    describe('and when experience received successfully', function () {

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

                        describe('and when expirience is not building', function () {

                            var experience;
                            beforeEach(function () {
                                experience = { buildingStatus: '', id: 'someId' };
                                getById.resolve(experience);
                            });

                            it('should change building status to \'inProgress\'', function () {

                                spyOn(http, 'post').andReturn($.Deferred().promise());

                                service.build(experience.id);

                                waitsFor(function () {
                                    return getById.promise.isFulfilled() && http.post.calls.length == 1;
                                });
                                runs(function () {
                                    expect(experience.buildingStatus).toEqual(constants.buildingStatuses.inProgress);
                                });
                            });

                            it('should send request', function () {
                                var post = $.Deferred();
                                spyOn(http, 'post').andReturn(post.promise());

                                post.resolve();
                                var promise = service.build().fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(http.post).toHaveBeenCalledWith('experience/build', { experienceId: experience.id });
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

                                            post.resolve();

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise.inspect().state).toEqual("rejected");
                                            });
                                        });

                                    });

                                    describe('and response.success is undefined', function () {

                                        it('should reject promise', function () {
                                            var promise = service.build();

                                            post.resolve({});

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise.inspect().state).toEqual("rejected");
                                            });
                                        });

                                    });

                                    describe('and response.success is true', function () {

                                        it('should set experience buildingStatus to \'succeed\'', function () {
                                            var promise = service.build();

                                            post.resolve({ success: true, data: { PackageUrl: 'SomeUrl', BuildOn: '/Date(1378106938845)/' } });

                                            waitsFor(function () {
                                                return promise.isFulfilled();
                                            });
                                            runs(function () {
                                                expect(experience.buildingStatus).toEqual(constants.buildingStatuses.succeed);
                                            });
                                        });

                                        it('should resolve promise with true', function () {
                                            var promise = service.build();

                                            var buildResuslt = { success: true, data: { PackageUrl: 'SomeUrl', BuildOn: '/Date(1378106938845)/' } };

                                            post.resolve(buildResuslt);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolvedWith(experience);
                                            });
                                        });

                                    });

                                    describe('and response.success is false', function () {

                                        it('should set experience buildingStatus to \'failed\'', function () {
                                            var promise = service.build();

                                            post.resolve({ success: false });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(experience.buildingStatus).toEqual(constants.buildingStatuses.failed);
                                            });
                                        });

                                        it('should set experience packageUrl to \'\'', function () {
                                            var promise = service.build();

                                            post.resolve({ success: false });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(experience.packageUrl).toEqual('');
                                            });
                                        });

                                        it('should reject promise ', function () {
                                            var promise = service.build();

                                            var buildResuslt = { success: false };

                                            post.resolve(buildResuslt);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith("Build failed");
                                            });
                                        });

                                    });
                                });

                                describe('and request failed', function () {

                                    it('should set experience buildingStatus to \'failed\'', function () {
                                        var promise = service.build();

                                        post.reject();

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(experience.buildingStatus).toEqual(constants.buildingStatuses.failed);
                                        });
                                    });

                                    it('should reject promise', function () {
                                        var promise = service.build();

                                        post.reject();

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith("Build failed");
                                        });
                                    });

                                    it('should set experience packageUrl to \'\'', function () {
                                        var promise = service.build();

                                        post.reject();

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(experience.packageUrl).toEqual('');
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