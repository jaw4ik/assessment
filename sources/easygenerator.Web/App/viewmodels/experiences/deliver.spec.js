define(['viewmodels/experiences/deliver'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/experienceRepository'),
            notify = require('notify');

        describe('viewModel [deliver]', function () {
            var template = { id: 'template id', name: 'template name', image: 'template image' };
            var experience = {
                id: '1',
                title: 'experience',
                objectives: [
                    { id: '0', title: 'A' },
                    { id: '1', title: 'a' },
                    { id: '2', title: 'z' },
                    { id: '3', title: 'b' }
                ],
                buildingStatus: 'inProgress',
                packageUrl: 'packageUrl',
                createdOn: 'createdOn',
                modifiedOn: 'modifiedOn',
                builtOn: 'builtOn',
                template: template,
                publishedPackageUrl: 'publishedPackageUrl',
                publishingState: 'inProgress'
            }
            ;

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(notify, 'info');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('isFirstBuild:', function () {

                it('should be observable', function () {
                    expect(viewModel.isFirstBuild).toBeObservable();
                });

            });
            
            describe('isFirstPublish:', function () {

                it('should be observable', function () {
                    expect(viewModel.isFirstPublish).toBeObservable();
                });

            });

            describe('status:', function () {

                it('should be observable', function () {
                    expect(viewModel.status).toBeObservable();
                });

            });
            
            describe('publishingState:', function () {

                it('should be publishingState', function () {
                    expect(viewModel.isFirstPublish).toBeObservable();
                });

            });
            
            describe('publishedPackageUrl:', function () {

                it('should be publishedPackageUrl', function () {
                    expect(viewModel.isFirstPublish).toBeObservable();
                });

            });

            it('should expose allowed build statuses', function () {
                expect(viewModel.statuses).toEqual(constants.buildingStatuses);
            });


            describe('buildExperience:', function () {

                var experiencerepositorygetByIdDefer;
                var experiencerepositorygetByIdPromise;

                var service = require('services/buildExperience');

                var build;

                beforeEach(function () {
                    build = Q.defer();
                    spyOn(service, 'build').andReturn(build.promise);
                    experiencerepositorygetByIdDefer = Q.defer();
                    experiencerepositorygetByIdPromise = experiencerepositorygetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(experiencerepositorygetByIdPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.buildExperience).toBeFunction();
                });

                it('should send event \'Build experience\'', function () {
                    viewModel.buildExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Build experience');
                });

                it('should change status to \'inProgress\'', function () {
                    viewModel.buildExperience();
                    expect(viewModel.status()).toEqual(constants.buildingStatuses.inProgress);
                });

                it('should start build of current experience', function () {
                    viewModel.id = 1;
                    viewModel.buildExperience();
                    expect(service.build).toHaveBeenCalledWith(1);
                });

                describe('when build is finished successfully', function () {

                    it('should change status to \'succeed\'', function () {
                        build.resolve({ buildingStatus: constants.buildingStatuses.succeed, buildOn: new Date(), packageUrl: 'SomeUrl' });

                        viewModel.id = 1;
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () { });

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.status()).toEqual(constants.buildingStatuses.succeed);
                        });

                    });

                    it('should resolve promise', function () {
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

                        viewModel.id = 1;
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () {
                        });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });

                    });

                    it('should be set isFirstBuild to false', function () {
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

                        viewModel.id = 1;
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () {
                        });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isFirstBuild()).toBeFalsy();
                        });
                    });

                    afterEach(function () {
                        experience.packageUrl = '';
                    });

                });

                describe('when build is failed', function () {

                    it('should change status to \'failed\'', function () {
                        build.reject();

                        viewModel.id = 1;
                        viewModel.buildExperience();

                        var promise = build.promise.fin(function () { });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.status()).toEqual(constants.buildingStatuses.failed);
                        });

                    });

                    it('should resolve promise', function () {
                        build.reject("Build failed");

                        viewModel.id = 1;
                        viewModel.buildExperience();

                        var promise = build.promise.fin(function () { });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith("Build failed");
                        });

                    });

                });
            });
            
            describe('publishExperience:', function () {

                var experiencerepositorygetByIdDefer;
                var experiencerepositorygetByIdPromise;

                var service = require('services/buildExperience');

                var publish;

                beforeEach(function () {
                    publish = Q.defer();
                    spyOn(service, 'publish').andReturn(publish.promise);
                    experiencerepositorygetByIdDefer = Q.defer();
                    experiencerepositorygetByIdPromise = experiencerepositorygetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(experiencerepositorygetByIdPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.publishExperience).toBeFunction();
                });

                it('should send event \'Publish experience\'', function () {
                    viewModel.publishExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Publish experience');
                });

                it('should change publishingState to \'inProgress\'', function () {
                    viewModel.publishExperience();
                    expect(viewModel.publishingState()).toEqual(constants.publishingStates.inProgress);
                });

                it('should start publish of current experience', function () {
                    viewModel.id = 1;
                    viewModel.publishExperience();
                    expect(service.publish).toHaveBeenCalledWith(1);
                });

                describe('when publish is finished successfully', function () {

                    it('should change status to \'succeed\'', function () {
                        publish.resolve({ publishingState: constants.publishingStates.succeed, publishedPackageUrl: 'publishedPackageUrl' });

                        viewModel.id = 1;
                        viewModel.publishExperience();
                        var promise = publish.promise.fin(function () { });

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.publishingState()).toEqual(constants.publishingStates.succeed);
                        });

                    });

                    it('should resolve promise', function () {
                        publish.resolve({ Success: true, PublishedPackageUrl: "publishedPackageUrl" });

                        viewModel.id = 1;
                        viewModel.publishExperience();
                        var promise = publish.promise.fin(function () {
                        });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });

                    });

                    it('should be set isFirstPublish to false', function () {
                        publish.resolve({ Success: true, PublishedPackageUrl: "publishedPackageUrl" });

                        viewModel.id = 1;
                        viewModel.publishExperience();
                        var promise = publish.promise.fin(function () {
                        });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isFirstPublish()).toBeFalsy();
                        });
                    });

                    afterEach(function () {
                        experience.publishedPackageUrl = '';
                    });

                });

                describe('when publish is failed', function () {

                    it('should change publishingState to \'failed\'', function () {
                        publish.reject();

                        viewModel.id = 1;
                        viewModel.publishExperience();

                        var promise = publish.promise.fin(function () { });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.publishingState()).toEqual(constants.publishingStates.failed);
                        });

                    });

                    it('should resolve promise', function () {
                        publish.reject("Publish failed");

                        viewModel.id = 1;
                        viewModel.publishExperience();

                        var promise = publish.promise.fin(function () { });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith("Publish failed");
                        });

                    });

                });
            });

            describe('downloadExperience:', function () {

                beforeEach(function () {
                    spyOn(router, 'download');
                });

                it('should be a function', function () {
                    expect(viewModel.downloadExperience).toBeFunction();
                });

                it('should send event \"Download experience\"', function () {
                    viewModel.downloadExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download experience');
                });

                it('should download experience package', function () {
                    viewModel.packageUrl('url');
                    viewModel.downloadExperience();
                    expect(router.download).toHaveBeenCalledWith('download/url');
                });
            });

            describe('activate:', function () {

                var getById;

                beforeEach(function () {
                    getById = Q.defer();
                    spyOn(repository, 'getById').andReturn(getById.promise);
                });


                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.activate()).toBePromise();
                });

                it('should get experience from repository', function () {
                    var id = 'experienceId';
                    viewModel.activate(id);
                    expect(repository.getById).toHaveBeenCalledWith(id);
                });

                describe('when experience does not exist', function () {

                    beforeEach(function () {
                        getById.reject();
                    });

                    it('should navigate to #404 ', function () {
                        var promise = viewModel.activate('experienceId');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.replace).toHaveBeenCalledWith('404');
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = viewModel.activate('experienceId');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

                describe('when experience exists', function () {

                    beforeEach(function () {
                        getById.resolve(experience);
                    });

                    it('should set current experience id', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.id).toEqual(experience.id);
                        });
                    });

                    it('should set current experience status', function () {
                        viewModel.status('');

                        var promise = viewModel.activate(experience.id);
                        var expectedStatus =
                            _.isNullOrUndefined(experience.packageUrl) || _.isEmptyOrWhitespace(experience.packageUrl) ?
                                constants.buildingStatuses.notStarted :
                                constants.buildingStatuses.succeed;
                        
                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.status()).toEqual(expectedStatus);
                        });
                    });

                    it('should set current packageUrl', function () {
                        viewModel.packageUrl('');

                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.packageUrl()).toEqual(experience.packageUrl);
                        });
                    });
                    

                    it('should set current experience publishingState', function () {
                        viewModel.publishingState('');

                        var promise = viewModel.activate(experience.id);

                        var expectedStatus =
                            _.isNullOrUndefined(experience.publishedPackageUrl) || _.isEmptyOrWhitespace(experience.publishedPackageUrl) ?
                                constants.publishingStates.notStarted :
                                constants.publishingStates.succeed;
                        
                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.publishingState()).toEqual(expectedStatus);
                        });
                    });
                    
                    it('should set current experience publishedPackageUrl', function () {
                        viewModel.publishedPackageUrl('');

                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.publishedPackageUrl()).toEqual(experience.publishedPackageUrl);
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = viewModel.activate(experience.id);

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
