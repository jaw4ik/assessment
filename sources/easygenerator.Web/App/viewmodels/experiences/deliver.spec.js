define(['viewmodels/experiences/deliver', 'models/experience'],
    function (viewModel, ExperienceModel) {
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
            var experienceCreatedOn = '/Date(1378106938845)/';
            var template = { id: 'template id', name: 'template name', image: 'template image' };
            var experience = new ExperienceModel({
                id: 'experienceId',
                title: 'title',
                template: template,
                createdOn: utils.getDateFromString(experienceCreatedOn),
                modifiedOn: utils.getDateFromString(experienceCreatedOn),
                objectives: []
            });

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

            describe('deliveringState:', function () {

                it('should be observable', function () {
                    expect(viewModel.deliveringState).toBeObservable();
                });

            });

            describe('publishedPackageUrl:', function () {

                it('should be observable', function () {
                    expect(viewModel.publishedPackageUrl).toBeObservable();
                });

            });

            describe('states:', function () {

                it('should be equal to allowed deliver states', function () {
                    expect(viewModel.states).toEqual(constants.deliveringStates);
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

            describe('publishExperience:', function () {

                var experiencerepositorygetByIdDefer;
                var experiencerepositorygetByIdPromise;
                
                beforeEach(function () {
                    spyOn(experience, 'publish');

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
                    experiencerepositorygetByIdDefer.resolve(experience);
                    var promise = viewModel.publishExperience();
                    
                    waitsFor(function () {
                        return !promise.isPending();
                    });

                    runs(function () {
                        expect(experience.publish).toHaveBeenCalled();
                    });
                });
            });

            describe('downloadExperience:', function () {

                var experiencerepositorygetByIdDefer;
                var experiencerepositorygetByIdPromise;

                beforeEach(function () {
                    spyOn(experience, 'build');

                    experiencerepositorygetByIdDefer = Q.defer();
                    experiencerepositorygetByIdPromise = experiencerepositorygetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(experiencerepositorygetByIdPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.downloadExperience).toBeFunction();
                });

                it('should send event \"Download experience\"', function () {
                    viewModel.downloadExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download experience');
                });

                it('should start build of current experience', function () {
                    experiencerepositorygetByIdDefer.resolve(experience);
                    var promise = viewModel.downloadExperience();

                    waitsFor(function () {
                        return !promise.isPending();
                    });

                    runs(function () {
                        expect(experience.build).toHaveBeenCalled();
                    });
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
                        getById.reject('reason');
                    });

                    it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                        router.activeItem.settings.lifecycleData = null;

                        var promise = viewModel.activate('experienceId');
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        });
                    });

                    it('should reject promise', function () {
                        var promise = viewModel.activate('experienceId');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('reason');
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

                it('should change experience deliveringState to \'building\'', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState('');
                    app.trigger(constants.messages.experience.build.started, experience);

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.building);
                });

            });

            describe('when any other experience build was started in any part of application', function () {

                it('should not change experience deliveringState', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState(constants.deliveringStates.notStarted);
                    app.trigger(constants.messages.experience.build.started, { id: '100500' });

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                });

            });

            describe('when current experience build completed in any part of application', function () {

                it('should update current packageUrl to the corresponding one', function () {
                    viewModel.id = experience.id;
                    viewModel.packageUrl("");

                    experience.packageUrl = "http://xxx.com";
                    app.trigger(constants.messages.experience.build.completed, experience);

                    expect(viewModel.packageUrl()).toEqual(experience.packageUrl);
                });

            });

            describe('when any other experience build completed in any part of application', function () {

                it('should not update current  deliveringState', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState(constants.deliveringStates.notStarted);
                    app.trigger(constants.messages.experience.build.completed, { id: '100500' });

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.notStarted);
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

                it('should update current deliveringState to \'failed\'', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState("");

                    app.trigger(constants.messages.experience.build.failed, experience.id, message);

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.failed);
                });

                it('should remove packageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.packageUrl("packageUrl");

                    app.trigger(constants.messages.experience.build.failed, experience.id, message);

                    expect(viewModel.packageUrl()).toEqual("");
                });

            });

            describe('when any other experience build failed in any part of application', function () {

                it('should not update current deliveringState to \'failed\'', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState("");

                    app.trigger(constants.messages.experience.build.failed, '100500');

                    expect(viewModel.deliveringState()).toEqual("");
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

                it('should change experience deliveringState to \'publishing\'', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState('');
                    app.trigger(constants.messages.experience.publish.started, experience);

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.publishing);
                });

            });

            describe('when any other experience publish was started in any part of application', function () {

                it('should not change experience deliveringState', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState(constants.deliveringStates.notStarted);
                    app.trigger(constants.messages.experience.publish.started, { id: '100500' });

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                });

            });

            describe('when current experience publish completed in any part of application', function () {

                it('should update current publishState to \'success\'', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState("");

                    experience.buildingStatus = constants.deliveringStates.succeed;
                    app.trigger(constants.messages.experience.publish.completed, experience);

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.succeed);
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
                    viewModel.deliveringState(constants.deliveringStates.notStarted);
                    app.trigger(constants.messages.experience.publish.completed, { id: '100500' });

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.notStarted);
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

                it('should update current deliveringState to \'failed\'', function () {
                    viewModel.id = experience.id;
                    viewModel.deliveringState("");

                    app.trigger(constants.messages.experience.publish.failed, experience.id, message);

                    expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.failed);
                });

                it('should remove publishedPackageUrl', function () {
                    viewModel.id = experience.id;
                    viewModel.publishedPackageUrl("publishedPackageUrl");

                    app.trigger(constants.messages.experience.publish.failed, experience.id, message);

                    expect(viewModel.publishedPackageUrl()).toEqual("");
                });

            });

            describe('when any other experience publish failed in any part of application', function () {

                it('should not update current deliveringState to \'failed\'', function () {
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
                        viewModel.deliveringState(viewModel.states.succeed);
                        
                        viewModel.openPublishedExperience();
                        expect(router.openUrl).toHaveBeenCalledWith(viewModel.publishedPackageUrl());
                    });

                });

                describe('when experience not published', function() {

                    it('should not open link', function () {
                        viewModel.publishedPackageUrl('Some url');
                        viewModel.deliveringState(viewModel.states.failed);
                        
                        viewModel.openPublishedExperience();
                        expect(router.openUrl).not.toHaveBeenCalledWith(viewModel.publishedPackageUrl());
                    });

                });

            });
        });

    }
);
