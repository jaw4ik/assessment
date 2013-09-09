define(['dataContext', 'constants', 'plugins/http', 'models/experience'],
    function (dataContext, constants, http, experienceModel) {

        var self = {};

        self.getCollection = function () {
            var deferred = Q.defer();

            deferred.resolve(dataContext.experiences);

            return deferred.promise;
        };

        self.getById = function (id) {
            var deferred = Q.defer();

            deferred.resolve(_.find(dataContext.experiences, function (item) {
                return item.id === id;
            }));

            return deferred.promise;
        };

        var
            addExperience = function (experience) {
                var deferred = Q.defer();

                if (_.isUndefined(experience)) {
                    deferred.reject('Experience data is undefined');
                }

                if (_.isNull(experience)) {
                    deferred.reject('Experience data is null');
                }

                http.post('api/experience/create', experience)
                    .done(function (response) {

                        if (_.isUndefined(response)) {
                            deferred.reject('Response is undefined');
                            return;
                        }

                        if (_.isNull(response)) {
                            deferred.reject('Response is null');
                            return;
                        }

                        if (!response.success) {
                            deferred.reject('Response is not successful');
                            return;
                        }

                        if (_.isUndefined(response.data)) {
                            deferred.reject('Response data is undefined');
                            return;
                        }

                        if (_.isNull(response.data)) {
                            deferred.reject('Response data is null');
                            return;
                        }

                        var
                            experienceId = response.data.Id,
                            createdOn = response.data.CreatedOn;

                        dataContext.experiences.push(experienceModel({
                            id: experienceId,
                            title: experience.title,
                            objectives: [],
                            buildingStatus: constants.buildingStatuses.notStarted,
                            createdOn: new Date(parseInt(createdOn.substr(6), 10)),
                            modifiedOn: new Date(parseInt(createdOn.substr(6), 10))
                        }));
                        deferred.resolve(experienceId);
                    })
                    .fail(function (reason) {
                        deferred.reject(reason);
                    });


                return deferred.promise;
            },

            removeExperience = function (experienceId) {
                var deferred = Q.defer();

                if (!_.isString(experienceId)) {

                    deferred.reject('Experience id (string) was expected');

                } else {

                    http.post('api/experience/delete', { experienceId: experienceId })
                        .done(function (response) {
                            if (!_.isObject(response)) {
                                deferred.reject('Response is not an object');
                                return;
                            }

                            if (!response.success) {
                                deferred.reject('Response is not successful');
                                return;
                            }

                            dataContext.experiences = _.reject(dataContext.experiences, function (experience) {
                                return experience.id == experienceId;
                            });

                            deferred.resolve();
                        })
                        .fail(function (reason) {
                            deferred.reject(reason);
                        });

                }

                return deferred.promise;
            }
        ;



        return {
            getById: self.getById,
            getCollection: self.getCollection,

            addExperience: addExperience,
            removeExperience: removeExperience
        };
    }
);