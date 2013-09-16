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
                                experience = { buildingStatus: '', template: { id: '0' } };
                                getById.resolve(experience);
                            });

                            describe('and when get template from repository', function () {

                                var getTemplateByIdDeferred;

                                beforeEach(function () {
                                    getTemplateByIdDeferred = Q.defer();
                                    spyOn(templateRepository, 'getById').andReturn(getTemplateByIdDeferred.promise);
                                });

                                describe('and when template doesnt exist', function () {
                                    beforeEach(function () {
                                        getTemplateByIdDeferred.resolve(null);
                                    });

                                    it('should reject promise', function () {
                                        var promise = service.build(experience.id);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejected();
                                        });
                                    });
                                });

                                describe('and when template exists', function () {
                                    var template = { id: '0', name: 'Quizzz' };
                                    beforeEach(function () {
                                        getTemplateByIdDeferred.resolve(template);
                                    });

                                    it('should set templateName', function () {

                                        spyOn(http, 'post').andReturn($.Deferred().promise());

                                        service.build(experience.id);

                                        waitsFor(function () {
                                            return getById.promise.isFulfilled() && http.post.calls.length == 1;
                                        });
                                        runs(function () {
                                            expect(experience.templateName).toEqual(template.name);
                                        });
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

                                                    var buildResuslt = { Success: true, PackageUrl: "20130818-09-59-16" };

                                                    post.resolve(buildResuslt);

                                                    waitsFor(function () {
                                                        return !promise.isPending();
                                                    });
                                                    runs(function () {
                                                        expect(promise).toBeResolved();
                                                        expect(promise.inspect().value).toEqual(buildResuslt);
                                                    });
                                                });

                                            });

                                            describe('and response.Success is false', function () {

                                                it('should set experience buildingStatus to \'failed\'', function () {
                                                    var promise = service.build();

                                                    post.resolve({ Success: false, PackageUrl: '' });

                                                    waitsFor(function () {
                                                        return promise.isFulfilled();
                                                    });
                                                    runs(function () {
                                                        expect(experience.buildingStatus).toEqual(constants.buildingStatuses.failed);
                                                    });
                                                });

                                                it('should set experience packageUrl to \'\'', function () {
                                                    var promise = service.build();

                                                    post.resolve({ Success: false, PackageUrl: '' });

                                                    waitsFor(function () {
                                                        return promise.isFulfilled();
                                                    });
                                                    runs(function () {
                                                        expect(experience.packageUrl).toEqual('');
                                                    });
                                                });

                                                it('should be resolve promise ', function () {
                                                    var promise = service.build();

                                                    var buildResuslt = { Success: false, PackageUrl: '' };

                                                    post.resolve(buildResuslt);

                                                    waitsFor(function () {
                                                        return !promise.isPending();
                                                    });
                                                    runs(function () {
                                                        expect(promise).toBeResolved();
                                                        expect(promise.inspect().value).toEqual(buildResuslt);
                                                    });
                                                });

                                            });
                                        });

                                        describe('and request failed', function () {

                                            it('should set experience buildingStatus to \'failed\'', function () {
                                                var promise = service.build();

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

                                                post.reject();

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeResolved();
                                                    expect(promise.inspect().value.Success).toEqual(false);
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

        });

    });