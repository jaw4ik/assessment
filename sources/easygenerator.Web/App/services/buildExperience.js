define(['durandal/app', 'plugins/http', 'repositories/experienceRepository', 'localization/localizationManager', 'constants'],
    function (app, http, repository, localizationManager, constants) {

        var build = function (experienceId) {
            var deferred = Q.defer();

            repository.getById(experienceId).then(function (experience) {
                if (_.isNull(experience)) {
                    deferred.reject('Experience was not found');
                    return;
                }

                if (experience.buildingStatus == constants.statuses.inProgress) {
                    deferred.reject('Experience is already building');
                    return;
                }

                experience.buildingStatus = constants.statuses.inProgress;

                app.trigger(constants.messages.experience.build.started, experience);

                http.post('experience/build', { experienceId: experience.id })
                    .done(function (response) {
                        if (_.isUndefined(response) || _.isUndefined(response.success)) {
                            deferred.reject('Response has invalid format');
                        }
                        if (response.success && response.data != undefined) {
                            experience.buildingStatus = constants.statuses.succeed;
                            experience.packageUrl = response.data.PackageUrl;
                            experience.builtOn = new Date(parseInt(response.data.BuildOn.substr(6), 10));
                            app.trigger(constants.messages.experience.build.completed, experience);
                            deferred.resolve(experience);
                        } else {
                            experience.buildingStatus = constants.statuses.failed;
                            experience.packageUrl = '';
                            var message = response.resourceKey ? localizationManager.localize(response.resourceKey) : response.message;
                            app.trigger(constants.messages.experience.build.failed, experience.id, message);
                            deferred.reject(message);
                        }
                    })
                    .fail(function (reason) {
                        experience.buildingStatus = constants.statuses.failed;
                        experience.packageUrl = '';
                        app.trigger(constants.messages.experience.build.failed, experience.id, reason);
                        deferred.reject(reason);
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

                if (experience.buildingStatus == constants.statuses.inProgress) {
                    deferred.reject('Experience is building, cannot publish during building');
                    return;
                }

                if (experience.publishingState == constants.statuses.inProgress) {
                    deferred.reject('Experience is already publishing');
                    return;
                }

                experience.publishingState = constants.statuses.inProgress;

                app.trigger(constants.messages.experience.publish.started, experience);

                http.post('experience/publish', { experienceId: experience.id })
                    .done(function (response) {
                        if (_.isUndefined(response) || _.isUndefined(response.success)) {
                            deferred.reject('Response has invalid format');
                        }
                        if (response.success && response.data != undefined) {
                            experience.publishingState = constants.statuses.succeed;
                            experience.publishedPackageUrl = response.data.PublishedPackageUrl;
                            app.trigger(constants.messages.experience.publish.completed, experience);
                            deferred.resolve(experience);
                        } else {
                            experience.publishingState = constants.statuses.failed;
                            experience.publishedPackageUrl = '';
                            var message = response.resourceKey ? localizationManager.localize(response.resourceKey) : response.message;
                            app.trigger(constants.messages.experience.publish.failed, experience.id, message);
                            deferred.reject(message);
                        }
                    })
                    .fail(function (reason) {
                        experience.publishingState = constants.statuses.failed;
                        experience.publishedPackageUrl = '';
                        app.trigger(constants.messages.experience.publish.failed, experience.id, reason);
                        deferred.reject(reason);
                    });
            });

            return deferred.promise;
        };

        return {
            build: build,
            publish: publish
        };
    });