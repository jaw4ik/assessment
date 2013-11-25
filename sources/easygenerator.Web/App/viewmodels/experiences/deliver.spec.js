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
                router.openUrl = function(url) {};

                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(router, 'openUrl');
                spyOn(notify, 'hide');
                spyOn(notify, 'error');
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

            describe('statuses:', function () {

                it('should be equal to allowed build statuses', function () {
                    expect(viewModel.statuses).toEqual(constants.statuses);
                });

            });

            describe('showBuildDescription:', function() {

                it('should be observable', function() {
                    expect(viewModel.showBuildDescription).toBeObservable();
                });

            });
            
            describe('showRebuildDescription:', function () {

                it('should be observable', function () {
                    expect(viewModel.showRebuildDescription).toBeObservable();
                });

            });

            describe('showDownloadDescription:', function () {

                it('should be observable', function () {
                    expect(viewModel.showDownloadDescription).toBeObservable();
                });

            });

            describe('showPublishDescription:', function () {

                it('should be observable', function () {
                    expect(viewModel.showPublishDescription).toBeObservable();
                });

            });

            describe('showRepublishDescription:', function () {

                it('should be observable', function () {
                    expect(viewModel.showRepublishDescription).toBeObservable();
                });

            });

            describe('showOpenLinkDescription:', function() {

                it('should be observable', function() {
                    expect(viewModel.showOpenLinkDescription).toBeObservable();
                });

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

                it('should hide notification', function () {
                    notify.hide.reset();
                    viewModel.buildExperience();
                    expect(notify.hide).toHaveBeenCalled();
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
                
                it('should hide notification', function () {
                    notify.hide.reset();
                    viewModel.publishExperience();
                    expect(notify.hide).toHaveBeenCalled();
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

            describe('when current experience build completed in any part of application', function () {

                it('should update current status to \'success\'', function () {
                    viewModel.id = experience.id;
                    viewModel.status("");

                    experience.buildingStatus = constants.statuses.succeed;
                    app.trigger(constants.messages.experience.build.completed, experience);

                    expect(viewModel.status()).toEqual(constants.statuses.succeed);
                });

                it('should update current packageUrl to the corresponding one', function () {
                    viewModel.id = experience.id;
                    viewModel.packageUrl("");

                    experience.packageUrl = "http://xxx.com";
                    app.trigger(constants.messages.experience.build.completed, experience);

                    expect(viewModel.packageUrl()).toEqual(experience.packageUrl);
                });

            });

            describe('when any other experience build completed in any part of application', function () {

                it('should not update current  status', function () {
                    viewModel.id = experience.id;
                    viewModel.status(constants.statuses.notStarted);
                    app.trigger(constants.messages.experience.build.completed, { id: '100500' });

                    expect(viewModel.status()).toEqual(constants.statuses.notStarted);
                });

                it('should not update current packageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.packageUrl("http://xxx.com");
                    app.trigger(constants.messages.experience.build.completed, { id: '100500' });

                    expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                });

            });

            describe('when current experience build failed in any part of application', function () {

                var message = "message";

                it('should update current status to \'failed\'', function () {
                    viewModel.id = experience.id;
                    viewModel.status("");

                    app.trigger(constants.messages.experience.build.failed, experience.id, message);

                    expect(viewModel.status()).toEqual(constants.statuses.failed);
                });

                it('should remove packageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.packageUrl("packageUrl");

                    app.trigger(constants.messages.experience.build.failed, experience.id, message);

                    expect(viewModel.packageUrl()).toEqual("");
                });

            });

            describe('when any other experience build failed in any part of application', function () {

                it('should not update current status to \'failed\'', function () {
                    viewModel.id = experience.id;
                    viewModel.status("");

                    app.trigger(constants.messages.experience.build.failed, '100500');

                    expect(viewModel.status()).toEqual("");
                });

                it('should not remove packageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.packageUrl("packageUrl");

                    app.trigger(constants.messages.experience.build.failed, '100500');

                    expect(viewModel.packageUrl()).toEqual("packageUrl");
                });

            });
            

            // publish
            describe('when current experience publish was started in any part of application', function () {

                it('should change experience publishState to \'inProgress\'', function () {
                    viewModel.id = experience.id;
                    viewModel.publishingState("");
                    app.trigger(constants.messages.experience.publish.started, experience);

                    expect(viewModel.publishingState()).toEqual(constants.statuses.inProgress);
                });

            });

            describe('when any other experience publish was started in any part of application', function () {

                it('should not change experience status', function () {
                    viewModel.id = experience.id;
                    viewModel.publishingState(constants.statuses.notStarted);
                    app.trigger(constants.messages.experience.publish.started, { id: '100500' });

                    expect(viewModel.publishingState()).toEqual(constants.statuses.notStarted);
                });

            });

            describe('when current experience publish completed in any part of application', function () {

                it('should update current publishState to \'success\'', function () {
                    viewModel.id = experience.id;
                    viewModel.publishingState("");

                    experience.buildingStatus = constants.statuses.succeed;
                    app.trigger(constants.messages.experience.publish.completed, experience);

                    expect(viewModel.publishingState()).toEqual(constants.statuses.succeed);
                });

                it('should update current publishedPackageUrl to the corresponding one', function () {
                    viewModel.id = experience.id;
                    viewModel.publishedPackageUrl("");

                    experience.publishedPackageUrl = "http://xxx.com";
                    app.trigger(constants.messages.experience.publish.completed, experience);

                    expect(viewModel.publishedPackageUrl()).toEqual(experience.publishedPackageUrl);
                });

            });

            describe('when any other experience publish completed in any part of application', function () {

                it('should not update current  publishState', function () {
                    viewModel.id = experience.id;
                    viewModel.publishingState(constants.statuses.notStarted);
                    app.trigger(constants.messages.experience.publish.completed, { id: '100500' });

                    expect(viewModel.publishingState()).toEqual(constants.statuses.notStarted);
                });

                it('should not update current publishedPackageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.publishedPackageUrl("http://xxx.com");
                    app.trigger(constants.messages.experience.publish.completed, { id: '100500' });

                    expect(viewModel.publishedPackageUrl()).toEqual("http://xxx.com");
                });

            });

            describe('when current experience publish failed in any part of application', function () {

                var message = "message";

                it('should update current publishingState to \'failed\'', function () {
                    viewModel.id = experience.id;
                    viewModel.publishingState("");

                    app.trigger(constants.messages.experience.publish.failed, experience.id, message);

                    expect(viewModel.publishingState()).toEqual(constants.statuses.failed);
                });

                it('should remove publishedPackageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.publishedPackageUrl("publishedPackageUrl");

                    app.trigger(constants.messages.experience.publish.failed, experience.id, message);

                    expect(viewModel.publishedPackageUrl()).toEqual("");
                });

            });

            describe('when any other experience publish failed in any part of application', function () {

                it('should not update current status to \'failed\'', function () {
                    viewModel.id = experience.id;
                    viewModel.publishedPackageUrl("");

                    app.trigger(constants.messages.experience.publish.failed, '100500');

                    expect(viewModel.publishedPackageUrl()).toEqual("");
                });

                it('should not remove packageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.publishedPackageUrl("packageUrl");

                    app.trigger(constants.messages.experience.publish.failed, '100500');

                    expect(viewModel.publishedPackageUrl()).toEqual("packageUrl");
                });

            });

            describe('openPublishedExperience:', function () {

                it('should be function', function() {
                    expect(viewModel.openPublishedExperience).toBeFunction();
                });

                describe('when experience successfully published', function() {

                    it('should open publish url', function () {
                        viewModel.publishedPackageUrl('Some url');
                        viewModel.status(viewModel.statuses.succeed);
                        viewModel.publishingState(viewModel.statuses.succeed);
                        
                        viewModel.openPublishedExperience();
                        expect(router.openUrl).toHaveBeenCalledWith(viewModel.publishedPackageUrl());
                    });

                });

                describe('when experience not published', function() {

                    it('should not open link', function () {
                        viewModel.publishedPackageUrl('Some url');
                        viewModel.status(viewModel.statuses.failed);
                        viewModel.publishingState(viewModel.statuses.failed);
                        
                        viewModel.openPublishedExperience();
                        expect(router.openUrl).not.toHaveBeenCalledWith(viewModel.publishedPackageUrl());
                    });

                });

            });
        });

    }
);
