define(['services/deliverService'],
    function (service) {
        "use strict";

        var
            localizationManager = require('localization/localizationManager'),
            http = require('plugins/http');

        describe('service [buildExperience]', function () {

            describe('buildExperience:', function () {
                var experience;
                var post;

                beforeEach(function () {
                    experience = { id: 'someId' };

                    post = $.Deferred();
                    spyOn(http, 'post').andReturn(post.promise());
                });

                it('should be function', function () {
                    expect(service.buildExperience).toEqual(jasmine.any(Function));
                });

                it('should return promise', function () {
                    var promise = service.buildExperience();

                    expect(promise).toBePromise();
                });

                it('should send request', function () {
                    post.resolve();
                    var promise = service.buildExperience(experience.id).fin(function () { });

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
                                var promise = service.buildExperience();

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
                                var promise = service.buildExperience();

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

                            it('should resolve promise with true', function () {
                                var promise = service.buildExperience();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith({ packageUrl: 'SomeUrl', builtOn: new Date(parseInt('/Date(1378106938845)/'.substr(6), 10)) });
                                });
                            });

                        });

                        describe('and response.success is false', function () {

                            describe('and response.resourceKey is a string', function () {

                                var lozalizedMessage = 'localized message';

                                beforeEach(function () {
                                    spyOn(localizationManager, 'localize').andReturn(lozalizedMessage);
                                });

                                it('should reject promise with localized message', function () {
                                    var promise = service.buildExperience();

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

                                it('should reject promise with response message', function () {
                                    var promise = service.buildExperience();

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

                        it('should reject promise', function () {
                            var promise = service.buildExperience();

                            post.resolve();
                            
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise.inspect().state).toEqual("rejected");
                            });
                        });

                    });

                });

            });

        });

        describe('service [publishExperience]', function () {

            describe('publishExperience:', function () {
                var experience;
                var post;

                beforeEach(function () {
                    experience = { id: 'someId' };

                    post = $.Deferred();
                    spyOn(http, 'post').andReturn(post.promise());
                });

                it('should be function', function () {
                    expect(service.publishExperience).toEqual(jasmine.any(Function));
                });

                it('should return promise', function () {
                    var promise = service.publishExperience();

                    expect(promise).toBePromise();
                });

                it('should send request', function () {
                    post.resolve();
                    var promise = service.publishExperience(experience.id).fin(function () { });

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
                                var promise = service.publishExperience();

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
                                var promise = service.publishExperience();

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

                            it('should resolve promise with true', function () {
                                var promise = service.publishExperience();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith({ publishedPackageUrl: 'SomeUrl' });
                                });
                            });

                        });

                        describe('and response.success is false', function () {

                            describe('and response.resourceKey is a string', function () {

                                var lozalizedMessage = 'localized message';

                                beforeEach(function () {
                                    spyOn(localizationManager, 'localize').andReturn(lozalizedMessage);
                                });

                                it('should reject promise with localized message', function () {
                                    var promise = service.publishExperience();

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

                                it('should reject promise with response message', function () {
                                    var promise = service.publishExperience();

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

                        it('should reject promise', function () {
                            var promise = service.publishExperience();

                            post.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise.inspect().state).toEqual("rejected");
                            });
                        });

                    });

                });

            });

        });
    });