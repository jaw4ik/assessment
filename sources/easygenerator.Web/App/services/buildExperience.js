define(['durandal/http', 'repositories/experienceRepository', 'constants'], function (http, repository, constants) {

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

            http.post('experience/build', experience)
                .done(function (response) {
                    if (_.isUndefined(response) || _.isUndefined(response.Success)) {
                        deferred.reject('Response has invalid format');
                    }
                    experience.buildingStatus = constants.buildingStatuses.succeed;
                    deferred.resolve(true);
                })
                .fail(function () {
                    experience.buildingStatus = constants.buildingStatuses.failed;
                    deferred.resolve(false);
                });

        });

        return deferred.promise;

    };

    return {
        build: build
    };
});