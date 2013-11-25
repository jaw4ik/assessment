define(['durandal/app', 'repositories/experienceRepository', 'plugins/router', 'services/buildExperience', 'notify', 'eventTracker', 'constants'], function (app, repository, router, service, notify, eventTracker, constants) {

    var
        events = {
            buildExperience: 'Build experience',
            downloadExperience: 'Download experience',
            publishExperience: 'Publish experience'
        };
    
    var viewModel = {
        id: '',
        packageUrl: ko.observable(),
        status: ko.observable(),
        statuses: constants.statuses,
        publishingState: ko.observable(),
        showBuildDescription: ko.observable(),
        showRebuildDescription: ko.observable(),
        showDownloadDescription: ko.observable(),
        showPublishDescription: ko.observable(),
        showRepublishDescription: ko.observable(),
        showOpenLinkDescription: ko.observable(),
        buildExperience: buildExperience,
        downloadExperience: downloadExperience,
        publishExperience: publishExperience,
        publishedPackageUrl: ko.observable(),
        openPublishedExperience: openPublishedExperience,
        activate: activate
    };


    viewModel.successfullyPublished = ko.computed(function () {
        return this.status() == this.statuses.succeed && this.publishingState() == this.statuses.succeed;
    }, viewModel);

    viewModel.packageExists = ko.computed(function () {
        return !_.isNullOrUndefined(this.packageUrl()) && !_.isEmptyOrWhitespace(this.packageUrl());
    }, viewModel);

    viewModel.publishPackageExists = ko.computed(function () {
        return !_.isNullOrUndefined(this.publishedPackageUrl()) && !_.isEmptyOrWhitespace(this.publishedPackageUrl());
    }, viewModel);

    function buildExperience() {
        eventTracker.publish(events.buildExperience);
        notify.hide();
        service.build(viewModel.id);
    }

    function downloadExperience() {
        eventTracker.publish(events.downloadExperience);
        router.download('download/' + viewModel.packageUrl());
    }

    function publishExperience() {
        eventTracker.publish(events.publishExperience);
        notify.hide();
        service.publish(viewModel.id);
    }
    
    function openPublishedExperience() {
        if (!viewModel.successfullyPublished()) {
            return;
        }

        router.openUrl(viewModel.publishedPackageUrl());
    }

    function activate(experienceId) {
        return repository.getById(experienceId).then(function (experience) {
            viewModel.id = experience.id;

            viewModel.status(_.isNullOrUndefined(experience.packageUrl) || _.isEmptyOrWhitespace(experience.packageUrl) ? constants.statuses.notStarted : constants.statuses.succeed);
            viewModel.publishingState(_.isNullOrUndefined(experience.publishedPackageUrl) || _.isEmptyOrWhitespace(experience.publishedPackageUrl) ? constants.statuses.notStarted : constants.statuses.succeed);

            viewModel.packageUrl(experience.packageUrl);
            viewModel.publishedPackageUrl(experience.publishedPackageUrl);
        }).fail(function () {
            router.replace('404');
        });
    }

    app.on(constants.messages.experience.build.started).then(function (experience) {
        if (experience.id == viewModel.id) {
            viewModel.status(constants.statuses.inProgress);
        }
    });

    app.on(constants.messages.experience.build.completed, function (experience) {
        if (experience.id == viewModel.id) {
            viewModel.status(constants.statuses.succeed);
            viewModel.packageUrl(experience.packageUrl);
        }
    });

    app.on(constants.messages.experience.build.failed, function (experienceId, message) {
        if (experienceId == viewModel.id) {
            viewModel.status(constants.statuses.failed);
            viewModel.packageUrl("");
        }
    });

    app.on(constants.messages.experience.publish.started).then(function (experience) {
        if (experience.id == viewModel.id) {
            viewModel.publishingState(constants.statuses.inProgress);
        }
    });

    app.on(constants.messages.experience.publish.completed, function (experience) {
        if (experience.id == viewModel.id) {
            viewModel.publishingState(constants.statuses.succeed);
            viewModel.publishedPackageUrl(experience.publishedPackageUrl);
        }
    });

    app.on(constants.messages.experience.publish.failed, function (experienceId, message) {
        if (experienceId == viewModel.id) {
            viewModel.publishingState(constants.statuses.failed);
            viewModel.publishedPackageUrl('');
        }
    });

    return viewModel;

})