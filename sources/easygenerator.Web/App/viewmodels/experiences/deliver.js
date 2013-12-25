define(['durandal/app', 'repositories/experienceRepository', 'plugins/router', 'services/deliverService', 'notify', 'eventTracker', 'constants', 'dom'], function (app, repository, router, service, notify, eventTracker, constants, dom) {

    var
        events = {
            downloadExperience: 'Download experience',
            publishExperience: 'Publish experience'
        };
    
    var viewModel = {
        id: '',
        packageUrl: ko.observable(),
        publishedPackageUrl: ko.observable(),
        states: constants.deliveringStates,
        deliveringState: ko.observable(),
        // variable to determine if experience is building for publish or for download
        buildingForPublish: ko.observable(),
        
        showOpenLinkDescription: ko.observable(),
        packageCreated: ko.observable(),
        
        downloadExperience: downloadExperience,
        publishExperience: publishExperience,
        
        openPublishedExperience: openPublishedExperience,
        activate: activate,
    };

    viewModel.isDelivering = ko.computed(function () {
        return this.deliveringState() === this.states.building || this.deliveringState() === this.states.publishing;
    }, viewModel);

    viewModel.publishPackageExists = ko.computed(function () {
        return !_.isNullOrUndefined(this.publishedPackageUrl()) && !_.isEmptyOrWhitespace(this.publishedPackageUrl());
    }, viewModel);

    function downloadExperience() {
        if (viewModel.deliveringState() !== constants.deliveringStates.building && viewModel.deliveringState() !== constants.deliveringStates.publishing) {
            viewModel.deliveringState(constants.deliveringStates.building);
            notify.hide();
            eventTracker.publish(events.downloadExperience);

            return repository.getById(viewModel.id).then(function(experience) {
                return experience.build().then(function() {
                    dom.clickElementById('packageLink');
                });
            });
        }
    }
    
    function publishExperience() {
        if (viewModel.deliveringState() !== constants.deliveringStates.building && viewModel.deliveringState() !== constants.deliveringStates.publishing) {
            viewModel.deliveringState(constants.deliveringStates.building);
            notify.hide();
            eventTracker.publish(events.publishExperience);
            return repository.getById(viewModel.id).then(function(experience) {
                viewModel.buildingForPublish(true);
                return experience.publish();
            });
        }
    }
    
    function openPublishedExperience() {
        if (viewModel.deliveringState() === constants.deliveringStates.succeed) {
            router.openUrl(viewModel.publishedPackageUrl());
        }
    }

    function activate(experienceId) {
        return repository.getById(experienceId).then(function (experience) {
            viewModel.id = experience.id;

            viewModel.deliveringState(_.isNullOrUndefined(experience.publishedPackageUrl) || _.isEmptyOrWhitespace(experience.publishedPackageUrl) ? constants.deliveringStates.notStarted : constants.deliveringStates.succeed);

            viewModel.packageUrl(experience.packageUrl);
            viewModel.publishedPackageUrl(experience.publishedPackageUrl);
        }).fail(function (reason) {
            router.activeItem.settings.lifecycleData = { redirect: '404' };
            throw reason;
        });
    }

    app.on(constants.messages.experience.build.started).then(function (experience) {
        if (experience.id === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.building);
        }
    });

    app.on(constants.messages.experience.build.completed, function (experience) {
        if (experience.id === viewModel.id) {
            if (viewModel.buildingForPublish() !== true) {
                viewModel.deliveringState(constants.deliveringStates.succeed);
            }
            viewModel.packageCreated(true);
            viewModel.packageUrl(experience.packageUrl);
            viewModel.buildingForPublish(false);
        }
    });

    app.on(constants.messages.experience.build.failed, function (experienceId) {
        if (experienceId === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.failed);
            viewModel.packageUrl('');
            viewModel.buildingForPublish(false);
        }
    });

    app.on(constants.messages.experience.publish.started).then(function (experience) {
        if (experience.id === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.publishing);
        }
    });

    app.on(constants.messages.experience.publish.completed, function (experience) {
        if (experience.id === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.succeed);
            viewModel.publishedPackageUrl(experience.publishedPackageUrl);
        }
    });

    app.on(constants.messages.experience.publish.failed, function (experienceId) {
        if (experienceId === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.failed);
            viewModel.publishedPackageUrl('');
        }
    });
    
    return viewModel;
})