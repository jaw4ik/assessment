define(['services/buildExperience'],
    function (service) {
        "use strict";

        var
            app = require('durandal/app'),
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
                            var post;

                            beforeEach(function () {
                                experience = { buildingStatus: '', id: 'someId' };
                                getById.resolve(experience);

                                spyOn(app, 'trigger');

                                post = $.Deferred();
                                spyOn(http, 'post').andReturn(post.promise());
                            });

                            it('should change building status to \'inProgress\'', function () {
                                http.post.reset();
                                service.build(experience.id);

                                waitsFor(function () {
                                    return getById.promise.isFulfilled() && http.post.calls.length == 1;
                                });
                                runs(function () {
                                    expect(experience.buildingStatus).toEqual(constants.buildingStatuses.inProgress);
                                });
                            });

                            it('should trigger \'experience:build-started\' event', function () {
                                http.post.reset();
                                service.build(experience.id);

                                waitsFor(function () {
                                    return getById.promise.isFulfilled() && http.post.calls.length == 1;
                                });
                                runs(function () {
                                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.build.started, experience);
                                });
                            });

                            it('should send request', function () {
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

                                        beforeEach(function () {
                                            post.resolve({ success: true, data: { PackageUrl: 'SomeUrl', BuildOn: '/Date(1378106938845)/' } });
                                        });

                                        it('should set experience buildingStatus to \'succeed\'', function () {
                                            var promise = service.build();

                                            waitsFor(function () {
                                                return promise.isFulfilled();
                                            });
                                            runs(function () {
                                                expect(experience.buildingStatus).toEqual(constants.buildingStatuses.succeed);
                                            });
                                        });

                                        it('should resolve promise with true', function () {
                                            var promise = service.build();

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

                                describe('and request to server has ended', function () {

                                    it('should trigger \'experience:build-finished\' event', function () {
                                        app.trigger.reset();
                                        var promise = service.build();

                                        post.reject();

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.build.finished, experience);
                                        });
                                    });

                                });

                            });

                        });
                    });
                });

            });

        });

        describe('service [publishExperience]', function () {

            describe('publish:', function () {

                var getById;

                beforeEach(function () {
                    getById = Q.defer();
                    spyOn(repository, 'getById').andReturn(getById.promise);
                });

                it('should be function', function () {
                    expect(service.publish).toEqual(jasmine.any(Function));
                });

                it('should return promise', function () {
                    var promise = service.publish();

                    getById.resolve(null);

                    expect(promise).toBePromise();
                });

                describe('when get experience from repository', function () {

                    describe('and experience was not found', function () {

                        it('should reject promise', function () {
                            var promise = service.publish();

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
                                var promise = service.publish();

                                getById.resolve({ buildingStatus: constants.buildingStatuses.inProgress });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise.inspect().state).toEqual("rejected");
                                });
                            });
                        });

                        describe('and experience is already publishing ', function () {

                            it('should reject promise', function () {
                                var promise = service.publish();

                                getById.resolve({ publishingState: constants.statuses.inProgress });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise.inspect().state).toEqual("rejected");
                                });
                            });
                        });

                        describe('and when expirience is not building and not publishing', function () {

                            var experience;
                            beforeEach(function () {
                                experience = { buildingStatus: '', id: 'someId' };
                                getById.resolve(experience);
                            });

                            it('should change publishing status to \'inProgress\'', function () {

                                spyOn(http, 'post').andReturn($.Deferred().promise());

                                service.publish(experience.id);

                                waitsFor(function () {
                                    return getById.promise.isFulfilled() && http.post.calls.length == 1;
                                });
                                runs(function () {
                                    expect(experience.publishingState).toEqual(constants.statuses.inProgress);
                                });
                            });

                            it('should send request', function () {
                                var post = $.Deferred();
                                spyOn(http, 'post').andReturn(post.promise());

                                post.resolve();
                                var promise = service.publish().fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(http.post).toHaveBeenCalledWith('experience/publish', { experienceId: experience.id });
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
                                            var promise = service.publish();

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
                                            var promise = service.publish();

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

                                        it('should set experience publishingState to \'succeed\'', function () {
                                            var promise = service.publish();

                                            post.resolve({ success: true, data: { PublishedPackageUrl: 'SomeUrl' } });

                                            waitsFor(function () {
                                                return promise.isFulfilled();
                                            });
                                            runs(function () {
                                                expect(experience.publishingState).toEqual(constants.statuses.succeed);
                                            });
                                        });

                                        it('should resolve promise with true', function () {
                                            var promise = service.publish();

                                            var publishResuslt = { success: true, data: { PublishedPackageUrl: 'SomeUrl' } };

                                            post.resolve(publishResuslt);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolvedWith(experience);
                                            });
                                        });

                                    });

                                    describe('and response.success is false', function () {

                                        it('should set experience publishingState to \'failed\'', function () {
                                            var promise = service.publish();

                                            post.resolve({ success: false });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(experience.publishingState).toEqual(constants.statuses.failed);
                                            });
                                        });

                                        it('should set experience PublishedPackageUrl to \'\'', function () {
                                            var promise = service.publish();

                                            post.resolve({ success: false });

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(experience.publishedPackageUrl).toEqual('');
                                            });
                                        });

                                        it('should reject promise ', function () {
                                            var promise = service.publish();

                                            var publishResuslt = { success: false };

                                            post.resolve(publishResuslt);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeRejectedWith("Publish failed");
                                            });
                                        });

                                    });
                                });

                                describe('and request failed', function () {

                                    it('should set experience publishingState to \'failed\'', function () {
                                        var promise = service.publish();

                                        post.reject();

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(experience.publishingState).toEqual(constants.statuses.failed);
                                        });
                                    });

                                    it('should reject promise', function () {
                                        var promise = service.publish();

                                        post.reject();

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith("Publish failed");
                                        });
                                    });

                                    it('should set experience PublishedPackageUrl to \'\'', function () {
                                        var promise = service.publish();

                                        post.reject();

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(experience.publishedPackageUrl).toEqual('');
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