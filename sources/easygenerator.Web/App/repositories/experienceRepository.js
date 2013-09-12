define(['dataContext', 'constants', 'plugins/http', 'models/experience'],
    function (dataContext, constants, http, experienceModel) {

        var
            getCollection = function () {
                var deferred = Q.defer();

                deferred.resolve(dataContext.experiences);

                return deferred.promise;
            },

            getById = function (id) {
                var deferred = Q.defer();

                var result = _.find(dataContext.experiences, function (item) {
                    return item.id === id;
                });

                if (typeof result !== "undefined") {
                    deferred.resolve(result);
                } else {
                    deferred.reject('Experience not exist');
                }

                return deferred.promise;
            },

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

            relateObjectives = function (experienceId, objectives) {
                var deferred = Q.defer();

                if (!_.isString(experienceId)) {
                    deferred.reject('Experience id is not valid');
                }

                if (!_.isArray(objectives)) {
                    deferred.reject('Objectives to relate are not array');
                }

                this.getById(experienceId)
                    .then(function (experince) {
                        if (_.isUndefined(experince.objectives)) {
                            deferred.reject('Objectives not exist');
                            return;
                        }

                        _.each(objectives, function (objective) {
                            var isRelated = _.any(experince.objectives, function (item) {
                                return item.id == objective.id;
                            });

                            if (!isRelated) {
                                experince.objectives.push(objective);
                            } else {
                                objectives = _.without(objectives, objective);
                            }
                        });

                        deferred.resolve(objectives);
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
            },

            unrelateObjectives = function (experienceId, objectives) {
                var deferred = Q.defer();

                if (!_.isString(experienceId)) {
                    deferred.reject('Experience id should be a string');
                }

                if (!_.isArray(objectives)) {
                    deferred.reject('objectives should be an array');
                }

                this.getById(experienceId)
                    .then(function (experience) {
                        experience.objectives = _.reject(experience.objectives, function (item) {
                            return _.contains(objectives, item.id);
                        });

                        deferred.resolve();
                    })
                    .fail(function (reason) {
                        deferred.reject(reason);
                    });

                return deferred.promise;
            },

            updateExperience = function (obj) {
                if (_.isNullOrUndefined(obj))
                    throw 'Invalid arguments';

                var deferred = Q.defer();

                this.getById(obj.id).then(function (experience) {

                    experience.title = obj.title;
                    experience.templateId = obj.templateId;
                    experience.modifiedOn = new Date();

                    deferred.resolve(experience);
                }).fail(function (reason) {
                    deferred.reject(reason);
                });

                return deferred.promise;
            };

        return {
            getById: getById,
            getCollection: getCollection,

            addExperience: addExperience,
            updateExperience: updateExperience,
            relateObjectives: relateObjectives,
            unrelateObjectives: unrelateObjectives,
            removeExperience: removeExperience
        };
    }
);