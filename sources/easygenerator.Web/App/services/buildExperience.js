define(['durandal/app', 'plugins/http', 'repositories/experienceRepository', 'repositories/templateRepository', 'constants'], function (app, http, repository, templateRepository, constants) {

    var build = function (experienceId) {
        var deferred = Q.defer();

        repository.getById(experienceId).then(function (experience) {
            if (_.isNull(experience)) {
                deferred.reject('Experience was not found');
                return;
            }

            if (experience.buildingStatus == constants.buildingStatuses.inProgress) {
                deferred.reject('Experience is already building');
                return;
            }

            experience.buildingStatus = constants.buildingStatuses.inProgress;

            app.trigger(constants.messages.experience.build.started, experience);

            http.post('experience/build', { experienceId: experience.id })
                .done(function (response) {
                    if (_.isUndefined(response) || _.isUndefined(response.success)) {
                        deferred.reject('Response has invalid format');
                    }
                    if (response.success && response.data != undefined) {
                        experience.buildingStatus = constants.buildingStatuses.succeed;
                        experience.packageUrl = response.data.PackageUrl;
                        experience.builtOn = new Date(parseInt(response.data.BuildOn.substr(6), 10));
                        deferred.resolve(experience);
                    } else {
                        experience.buildingStatus = constants.buildingStatuses.failed;
                        experience.packageUrl = '';
                        deferred.reject("Build failed");
                    }
                })
                .fail(function () {
                    experience.buildingStatus = constants.buildingStatuses.failed;
                    experience.packageUrl = '';
                    deferred.reject("Build failed");
                }).always(function () {
                    app.trigger(constants.messages.experience.build.finished, experience);
                });
        });

        return deferred.promise;

    };

    var publish = function (experienceId) {
        var deferred = Q.defer();

        repository.getById(experienceId).then(function (experience) {
            if (_.isNull(experience)) {
                deferred.reject('Experience was not found');
                return;
            }

            if (experience.buildingStatus == constants.buildingStatuses.inProgress) {
                deferred.reject('Experience is building, cannot publish during building');
                return;
            }
            
            if (experience.publishingState == constants.publishingStates.inProgress) {
                deferred.reject('Experience is already publishing');
                return;
            }

            experience.publishingState = constants.publishingStates.inProgress;

            http.post('experience/publish', { experienceId: experience.id })
                .done(function (response) {
                    if (_.isUndefined(response) || _.isUndefined(response.success)) {
                        deferred.reject('Response has invalid format');
                    }
                    if (response.success && response.data != undefined) {
                        experience.publishingState = constants.publishingStates.succeed;
                        experience.publishedPackageUrl = response.data.PublishedPackageUrl;
                        deferred.resolve(experience);
                    } else {
                        experience.publishingState = constants.publishingStates.failed;
                        experience.publishedPackageUrl = '';
                        deferred.reject("Publish failed");
                    }
                })
                .fail(function () {
                    experience.publishingState = constants.publishingStates.failed;
                    experience.publishedPackageUrl = '';
                    deferred.reject("Publish failed");
                });
        });

        return deferred.promise;

    };

    return {
        build: build,
        publish: publish
    };
});