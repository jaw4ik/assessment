define(['repositories/experienceRepository', 'plugins/router', 'services/buildExperience', 'eventTracker', 'constants'], function (repository, router, service, eventTracker, constants) {

    var
        events = {
            buildExperience: 'Build experience',
            downloadExperience: 'Download experience',
        },
        sendEvent = function (eventName) {
            eventTracker.publish(eventName);
        };

    var
        id = "",
        packageUrl = ko.observable(),
        isFirstBuild = ko.observable(true),
        status = ko.observable(),

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


        activate = function (experienceId) {
            var that = this;
            return repository.getById(experienceId).then(function (experience) {
                that.id = experience.id;
                that.status(experience.buildingStatus);
                that.packageUrl(experience.packageUrl);
                that.isFirstBuild(_.isNullOrUndefined(experience.packageUrl) || _.isEmptyOrWhitespace(experience.packageUrl));
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
        isFirstBuild: isFirstBuild,
        buildExperience: buildExperience,
        downloadExperience: downloadExperience,

        activate: activate
    };

})