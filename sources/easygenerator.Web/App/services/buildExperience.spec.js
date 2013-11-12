define(['services/buildExperience'],
    function (service) {
        "use strict";

        var
            app = require('durandal/app'),
            constants = require('constants'),
            repository = require('repositories/experienceRepository'),
            localizationManager = require('localization/localizationManager'),
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

                                        it('should trigger \'experience:build-completed\' event', function () {
                                            var promise = service.build();

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.build.completed, experience);
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

                                        describe('and response.resourceKey is a string', function () {

                                            var lozalizedMessage = 'localized message';

                                            beforeEach(function () {
                                                spyOn(localizationManager, 'localize').andReturn(lozalizedMessage);
                                            });

                                            it('should trigger \'experience:build-failed\' event with localized message', function () {
                                                var promise = service.build();

                                                var buildResult = { success: false, resourceKey: 'message' };

                                                post.resolve(buildResult);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.build.failed, experience.id, lozalizedMessage);
                                                });
                                            });

                                            it('should reject promise with localized message', function () {
                                                var promise = service.build();

                                                var buildResult = { success: false, resourceKey: 'message' };

                                                post.resolve(buildResult);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeRejectedWith(lozalizedMessage);
                                                });
                                            });

                                        });

                                        describe('and response.resourceKey does not exist', function () {

                                            it('should trigger \'experience:build-failed\' event with response message', function () {
                                                var promise = service.build();

                                                var buildResult = { success: false, message: 'message' };

                                                post.resolve(buildResult);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.build.failed, experience.id, buildResult.message);
                                                });
                                            });

                                            it('should reject promise with response message', function () {
                                                var promise = service.build();

                                                var buildResult = { success: false, message: 'message' };

                                                post.resolve(buildResult);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeRejectedWith(buildResult.message);
                                                });
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

                                    describe('and when reason status is 503', function () {
                                        it('should not trigger \'experience:build-failed\' event', function () {
                                            var promise = service.build();

                                            var reason = { status: 503 };
                                            post.reject(reason);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.experience.build.failed, experience.id, reason);
                                            });
                                        });
                                    });

                                    describe('and when reason status is not 503', function () {
                                        it('should trigger \'experience:build-failed\' event', function () {
                                            var promise = service.build();
                                            var reason = { status: 500 };
                                            post.reject(reason);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.build.failed, experience.id, reason);
                                            });
                                        });
                                    });

                                    it('should reject promise', function () {
                                        var reason = 'reason';
                                        var promise = service.build();

                                        post.reject(reason);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith(reason);
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
                            var post;

                            beforeEach(function () {
                                experience = { publishingState: '', id: 'someId' };
                                getById.resolve(experience);

                                spyOn(app, 'trigger');

                                post = $.Deferred();
                                spyOn(http, 'post').andReturn(post.promise());
                            });

                            it('should change publishing status to \'inProgress\'', function () {

                                http.post.reset();

                                service.publish(experience.id);

                                waitsFor(function () {
                                    return getById.promise.isFulfilled() && http.post.calls.length == 1;
                                });
                                runs(function () {
                                    expect(experience.publishingState).toEqual(constants.statuses.inProgress);
                                });
                            });

                            it('should trigger \'experience:publish-started\' event', function () {
                                http.post.reset();
                                service.publish(experience.id);

                                waitsFor(function () {
                                    return getById.promise.isFulfilled() && http.post.calls.length == 1;
                                });
                                runs(function () {
                                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.publish.started, experience);
                                });
                            });

                            it('should send request', function () {
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

                                        beforeEach(function () {
                                            post.resolve({ success: true, data: { PublishedPackageUrl: 'SomeUrl' } });
                                        });

                                        it('should set experience publishingState to \'succeed\'', function () {
                                            var promise = service.publish();

                                            waitsFor(function () {
                                                return promise.isFulfilled();
                                            });
                                            runs(function () {
                                                expect(experience.publishingState).toEqual(constants.statuses.succeed);
                                            });
                                        });

                                        it('should trigger \'experience:publish-completed\' event', function () {
                                            var promise = service.publish();

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.publish.completed, experience);
                                            });
                                        });

                                        it('should resolve promise with true', function () {
                                            var promise = service.publish();

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

                                        describe('and response.resourceKey is a string', function () {

                                            var lozalizedMessage = 'localized message';

                                            beforeEach(function () {
                                                spyOn(localizationManager, 'localize').andReturn(lozalizedMessage);
                                            });

                                            it('should trigger \'experience:publish-failed\' event with localized message', function () {
                                                var promise = service.publish();

                                                var publishResult = { success: false, resourceKey: 'message' };

                                                post.resolve(publishResult);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.publish.failed, experience.id, lozalizedMessage);
                                                });
                                            });

                                            it('should reject promise with localized message', function () {
                                                var promise = service.publish();

                                                var publishResult = { success: false, resourceKey: 'message' };

                                                post.resolve(publishResult);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeRejectedWith(lozalizedMessage);
                                                });
                                            });

                                        });

                                        describe('and response.resourceKey does not exist', function () {

                                            it('should trigger \'experience:publish-failed\' event with response message', function () {
                                                var promise = service.publish();

                                                var publishResult = { success: false, message: 'message' };

                                                post.resolve(publishResult);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.publish.failed, experience.id, publishResult.message);
                                                });
                                            });

                                            it('should reject promise with response message', function () {
                                                var promise = service.publish();

                                                var publishResult = { success: false, message: 'message' };

                                                post.resolve(publishResult);

                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeRejectedWith(publishResult.message);
                                                });
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

                                    describe('and when reason status is not 503', function () {
                                        it('should trigger \'experience:build-failed\' event', function () {
                                            var promise = service.publish();

                                            var reason = {status:500};
                                            post.reject(reason);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(app.trigger).toHaveBeenCalledWith(constants.messages.experience.publish.failed, experience.id, reason);
                                            });
                                        });
                                    });
                                    
                                    describe('and when reason status is 503', function () {
                                        it('should not trigger \'experience:build-failed\' event', function () {
                                            var promise = service.publish();

                                            var reason = { status: 503 };
                                            post.reject(reason);

                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.experience.publish.failed, experience.id, reason);
                                            });
                                        });
                                    });

                                    it('should reject promise', function () {
                                        var reason = 'reason';
                                        var promise = service.publish();

                                        post.reject(reason);

                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeRejectedWith(reason);
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