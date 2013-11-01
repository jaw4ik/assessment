define(['repositories/experienceRepository', 'plugins/router', 'services/buildExperience', 'eventTracker', 'constants'], function (repository, router, service, eventTracker, constants) {

    var
        events = {
            buildExperience: 'Build experience',
            downloadExperience: 'Download experience',
            publishExperience: 'Publish experience'
        },
        sendEvent = function (eventName) {
            eventTracker.publish(eventName);
        };

    var
        id = "",
        packageUrl = ko.observable(),
        isFirstBuild = ko.observable(true),
        isFirstPublish = ko.observable(false),
        status = ko.observable(),
        publishingState = ko.observable(),
        publishedPackageUrl = ko.observable(),
        

        buildExperience = function () {
            sendEvent(events.buildExperience);
            status(constants.buildingStatuses.inProgress);

            var that = this;
            service.build(this.id).then(function (updatedExperience) {
                that.status(updatedExperience.buildingStatus);
                that.packageUrl(updatedExperience.packageUrl);
                that.isFirstBuild(false);
            }).fail(function () {
                that.status(constants.buildingStatuses.failed);
            });
        },

        downloadExperience = function () {
            sendEvent(events.downloadExperience);
            router.download('download/' + packageUrl());
        },
        
        publishExperience = function () {
            sendEvent(events.publishExperience);
            publishingState(constants.publishingStates.inProgress);

            var that = this;
            service.publish(this.id).then(function (updatedExperience) {
                that.isFirstPublish(false);
                that.publishingState(updatedExperience.publishingState);
                that.publishedPackageUrl(updatedExperience.publishedPackageUrl);
            }).fail(function () {
                that.publishingState(constants.publishingStates.failed);
            });
        },

        activate = function (experienceId) {
            var that = this;
            return repository.getById(experienceId).then(function (experience) {
                that.id = experience.id;
                
                that.status(_.isNullOrUndefined(experience.packageUrl) || _.isEmptyOrWhitespace(experience.packageUrl) ? constants.buildingStatuses.notStarted : constants.buildingStatuses.succeed);
                that.publishingState(_.isNullOrUndefined(experience.publishedPackageUrl) || _.isEmptyOrWhitespace(experience.publishedPackageUrl) ? constants.publishingStates.notStarted : constants.publishingStates.succeed);
                
                that.packageUrl(experience.packageUrl);
                that.publishedPackageUrl(experience.publishedPackageUrl);
                
                that.isFirstBuild(that.status() == constants.buildingStatuses.notStarted);
                that.isFirstPublish(that.publishingState() == constants.publishingStates.notStarted);
            }).fail(function () {
                router.replace('404');
            });
        }
    ;


    return {
        id: id,
        packageUrl: packageUrl,
        status: status,
        statuses: constants.buildingStatuses,
        publishingState: publishingState,
        publishingStates: constants.publishingStates,
        isFirstBuild: isFirstBuild,
        isFirstPublish: isFirstPublish,
        buildExperience: buildExperience,
        downloadExperience: downloadExperience,
        publishExperience: publishExperience,
        publishedPackageUrl: publishedPackageUrl,

        activate: activate
    };

})