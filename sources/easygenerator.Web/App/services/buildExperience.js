define(['plugins/http', 'repositories/experienceRepository', 'repositories/templateRepository', 'constants'], function (http, repository, templateRepository, constants) {

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
                });
        });

        return deferred.promise;

    };

    return {
        build: build
    };
});