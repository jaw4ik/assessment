define(['durandal/app', 'repositories/experienceRepository', 'plugins/router', 'services/buildExperience', 'eventTracker', 'constants'], function (app, repository, router, service, eventTracker, constants) {

    var
        events = {
            buildExperience: 'Build experience',
            downloadExperience: 'Download experience',
            publishExperience: 'Publish experience'
        },
        sendEvent = function (eventName) {
            eventTracker.publish(eventName);
        };


    var viewModel = {
        id: '',
        packageUrl: ko.observable(),
        status: ko.observable(),
        statuses: constants.statuses,
        publishingState: ko.observable(),
        isFirstPublish: ko.observable(false),
        buildExperience: buildExperience,
        downloadExperience: downloadExperience,
        publishExperience: publishExperience,
        publishedPackageUrl: ko.observable(),

        activate: activate
    };


    viewModel.packageExists = ko.computed(function () {
        return !_.isNullOrUndefined(this.packageUrl()) && !_.isEmptyOrWhitespace(this.packageUrl());
    }, viewModel);

    function buildExperience() {
        sendEvent(events.buildExperience);
        service.build(viewModel.id);
    }


    function downloadExperience() {
        sendEvent(events.downloadExperience);
        router.download('download/' + viewModel.packageUrl());
    }

    function publishExperience() {
        sendEvent(events.publishExperience);
        viewModel.publishingState(constants.statuses.inProgress);

        service.publish(viewModel.id).then(function (updatedExperience) {
            viewModel.isFirstPublish(false);
            viewModel.publishingState(updatedExperience.publishingState);
            viewModel.publishedPackageUrl(updatedExperience.publishedPackageUrl);
        }).fail(function () {
            viewModel.publishingState(constants.statuses.failed);
        });
    }

    function activate(experienceId) {
        return repository.getById(experienceId).then(function (experience) {
            viewModel.id = experience.id;

            viewModel.status(experience.buildingStatus);
            viewModel.publishingState(_.isNullOrUndefined(experience.publishedPackageUrl) || _.isEmptyOrWhitespace(experience.publishedPackageUrl) ? constants.statuses.notStarted : constants.statuses.succeed);

            viewModel.packageUrl(experience.packageUrl);
            viewModel.publishedPackageUrl(experience.publishedPackageUrl);

            viewModel.isFirstPublish(viewModel.publishingState() == constants.statuses.notStarted);
        }).fail(function () {
            router.replace('404');
        });
    }

    app.on(constants.messages.experience.build.started).then(function (experience) {
        if (experience.id == viewModel.id) {
            viewModel.status(constants.statuses.inProgress);
        }
    });

    app.on(constants.messages.experience.build.finished, function (experience) {
        if (experience.id == viewModel.id) {
            viewModel.status(experience.buildingStatus);
            viewModel.packageUrl(experience.packageUrl);
        }
    });

    return viewModel;

})