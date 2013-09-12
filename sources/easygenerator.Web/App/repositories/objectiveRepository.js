define(['dataContext', 'constants', 'plugins/http', 'models/objective'],
    function (dataContext, constants, http, objectiveModel) {

        var
            getCollection = function () {
                var deferred = Q.defer();

                deferred.resolve(dataContext.objectives);

                return deferred.promise;
            },

            getById = function (id) {
                var deferred = Q.defer();

                if (_.isNullOrUndefined(id)) {
                    throw 'Invalid argument';
                }

                var result = _.find(dataContext.objectives, function (item) {
                    return item.id === id;
                });

                if (_.isUndefined(result)) {
                    deferred.reject('Objective does not exist');
                }
                else {
                    deferred.resolve(result);
                }

                return deferred.promise;
            },

            addObjective = function (objective) {
                var deferred = Q.defer();

                if (_.isUndefined(objective)) {
                    deferred.reject('Objective data is undefined');
                }

                if (_.isNull(objective)) {
                    deferred.reject('Objective data is null');
                }

                http.post('api/objective/create', objective)
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

                        var objectiveId = response.data.Id,
                            createdOn = response.data.CreatedOn;

                        dataContext.objectives.push(objectiveModel({
                            id: objectiveId,
                            title: objective.title,
                            image: constants.defaultObjectiveImage,
                            questions: [],
                            createdOn: new Date(parseInt(createdOn.substr(6), 10)),
                            modifiedOn: new Date(parseInt(createdOn.substr(6), 10))
                        }));
                        deferred.resolve(objectiveId);
                    })
                    .fail(function (reason) {
                        deferred.reject(reason);
                    });


                return deferred.promise;
            },

            updateObjective = function (obj) {
                var deferred = Q.defer();

                if (_.isObject(obj) && _.isString(obj.id) && _.isString(obj.title)) {

                    http.post('api/objective/update', { objectiveId: obj.id, title: obj.title }).then(function (response) {

                        if (!_.isObject(response)) {
                            deferred.reject('Response is not an object');
                            return;
                        }

                        if (!_.isObject(response.data)) {
                            deferred.reject('Response data is not an object');
                            return;
                        }

                        if (!_.isString(response.data.ModifiedOn)) {
                            deferred.reject('Response does not have modification date');
                            return;
                        }

                        var objective = _.find(dataContext.objectives, function (item) {
                            return item.id === obj.id;
                        });

                        if (!_.isObject(objective)) {
                            deferred.reject('Objective does not exist in dataContext');
                            return;
                        }

                        objective.title = obj.title;
                        objective.modifiedOn = new Date(parseInt(response.data.ModifiedOn.substr(6), 10));
                        deferred.resolve(objective.modifiedOn);

                    }).fail(function (reason) {
                        deferred.reject(reason);
                    });

                } else {
                    deferred.reject('Objective data has invalid format');
                }

                return deferred.promise;
            },

            removeObjective = function (objectiveId) {

                var deferred = Q.defer();

                if (!_.isString(objectiveId)) {

                    deferred.reject('Objective id was expected');

                } else {

                    http.post('api/objective/delete', { objectiveId: objectiveId })
                        .done(function (response) {
                            if (!_.isObject(response)) {
                                deferred.reject('Response is not an object');
                                return;
                            }

                            if (!response.success) {
                                deferred.reject('Response is not successful');
                                return;
                            }

                            dataContext.objectives = _.reject(dataContext.objectives, function (objective) {
                                return objective.id == objectiveId;
                            });

                            deferred.resolve();
                        })
                        .fail(function (reason) {
                            deferred.reject(reason);
                        });

                }

                return deferred.promise;
            };

        return {
            getById: getById,
            getCollection: getCollection,

            addObjective: addObjective,
            removeObjective: removeObjective,

            updateObjective: updateObjective,
        };
    }
);