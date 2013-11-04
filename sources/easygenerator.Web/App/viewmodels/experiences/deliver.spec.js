define(['viewmodels/experiences/deliver'],
    function (viewModel) {
        "use strict";

        var
            app = require('durandal/app'),
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/experienceRepository'),
            notify = require('notify')
        ;

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
            };

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(notify, 'info');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('packageExists:', function () {

                it('should be computed', function () {
                    expect(viewModel.packageExists).toBeComputed();
                });

                describe('when packageUrl is not defined', function () {

                    it('should be false', function () {
                        viewModel.packageUrl(undefined);
                        expect(viewModel.packageExists()).toBeFalsy();
                    });

                });

                describe('when packageUrl is empty', function () {

                    it('should be false', function () {
                        viewModel.packageUrl("");
                        expect(viewModel.packageExists()).toBeFalsy();
                    });

                });

                describe('when packageUrl is whitespace', function () {

                    it('should be false', function () {
                        viewModel.packageUrl("    ");
                        expect(viewModel.packageExists()).toBeFalsy();
                    });

                });

                describe('when packageUrl is a non-whitespace string', function () {

                    it('should be true', function () {
                        viewModel.packageUrl("packageUrl");
                        expect(viewModel.packageExists()).toBeTruthy();
                    });

                });

            });

            describe('publishPackageExists:', function () {

                it('should be computed', function () {
                    expect(viewModel.publishPackageExists).toBeComputed();
                });
                
                describe('when publishPackageUrl is not defined', function () {

                    it('should be false', function () {
                        viewModel.publishedPackageUrl(undefined);
                        expect(viewModel.publishPackageExists()).toBeFalsy();
                    });

                });

                describe('when publishPackageUrl is empty', function () {

                    it('should be false', function () {
                        viewModel.publishedPackageUrl("");
                        expect(viewModel.publishPackageExists()).toBeFalsy();
                    });

                });

                describe('when publishPackageUrl is whitespace', function () {

                    it('should be false', function () {
                        viewModel.publishedPackageUrl("    ");
                        expect(viewModel.publishPackageExists()).toBeFalsy();
                    });

                });

                describe('when publishPackageUrl is a non-whitespace string', function () {

                    it('should be true', function () {
                        viewModel.publishedPackageUrl("packageUrl");
                        expect(viewModel.publishPackageExists()).toBeTruthy();
                    });

                });

            });

            describe('status:', function () {

                it('should be observable', function () {
                    expect(viewModel.status).toBeObservable();
                });

            });

            describe('publishingState:', function () {

                it('should be observable', function () {
                    expect(viewModel.publishingState).toBeObservable();
                });

            });

            describe('publishedPackageUrl:', function () {

                it('should be observable', function () {
                    expect(viewModel.publishedPackageUrl).toBeObservable();
                });

            });

            it('should expose allowed build statuses', function () {
                expect(viewModel.statuses).toEqual(constants.statuses);
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

                it('should start build of current experience', function () {
                    viewModel.id = 1;
                    viewModel.buildExperience();
                    expect(service.build).toHaveBeenCalledWith(1);
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

                it('should start publish of current experience', function () {
                    viewModel.id = 1;
                    viewModel.publishExperience();
                    expect(service.publish).toHaveBeenCalledWith(1);
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
                                constants.statuses.notStarted :
                                constants.statuses.succeed;

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

            describe('when current experience build was started in any part of application', function () {

                it('should change experience status to \'inProgress\'', function () {
                    viewModel.id = experience.id;
                    viewModel.status("");
                    app.trigger(constants.messages.experience.build.started, experience);

                    expect(viewModel.status()).toEqual(constants.statuses.inProgress);
                });

            });

            describe('when any other experience build was started in any part of application', function () {

                it('should not change experience status', function () {
                    viewModel.id = experience.id;
                    viewModel.status(constants.statuses.notStarted);
                    app.trigger(constants.messages.experience.build.started, { id: '100500' });

                    expect(viewModel.status()).toEqual(constants.statuses.notStarted);
                });

            });

            describe('when current experience build was finished in any part of application', function () {

                it('should update current status to the corresponding one', function () {
                    viewModel.id = experience.id;
                    viewModel.status("");

                    experience.buildingStatus = constants.statuses.failed;
                    app.trigger(constants.messages.experience.build.finished, experience);

                    expect(viewModel.status()).toEqual(constants.statuses.failed);
                });

                it('should update current packageUrl to the corresponding one', function () {
                    viewModel.id = experience.id;
                    viewModel.packageUrl("");

                    experience.packageUrl = "http://xxx.com";
                    app.trigger(constants.messages.experience.build.finished, experience);

                    expect(viewModel.packageUrl()).toEqual(experience.packageUrl);
                });

            });

            describe('when any other experience build was finished in any part of application', function () {

                it('should not update current  status', function () {
                    viewModel.id = experience.id;
                    viewModel.status(constants.statuses.notStarted);
                    app.trigger(constants.messages.experience.build.finished, { id: '100500' });

                    expect(viewModel.status()).toEqual(constants.statuses.notStarted);
                });

                it('should not update current packageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.packageUrl("http://xxx.com");
                    app.trigger(constants.messages.experience.build.finished, { id: '100500' });

                    expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                });

            });

        });

    });
