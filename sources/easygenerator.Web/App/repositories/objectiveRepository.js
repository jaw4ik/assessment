define(['dataContext', 'constants', 'plugins/http', 'models/objective'],
    function (dataContext, constants, http, objectiveModel) {

        var getCollection = function () {
            var deferred = Q.defer();

            deferred.resolve(dataContext.objectives);

            return deferred.promise;
        },

        getById = function (id) {
            var deferred = Q.defer();

            deferred.resolve(_.find(dataContext.objectives, function (item) {
                return item.id === id;
            }));

            return deferred.promise;
        },

        update = function (obj) {
            if (_.isNullOrUndefined(obj))
                throw 'Invalid arguments';

            var deferred = Q.defer();

            this.getById(obj.id).then(function (objective) {
                if (!_.isObject(objective)) {
                    deferred.reject('Objective does not exist');
                    return;
                }

                objective.title = obj.title;
                objective.modifiedOn = Date.now();

                deferred.resolve(objective);
            });

            return deferred.promise;
        },

        removeObjective = function (id) {
            if (_.isNullOrUndefined(id))
                throw 'Id is null or undefined';

            var deferred = Q.defer();

            this.getById(id).then(function (objective) {
                if (!_.isObject(objective)) {
                    deferred.reject('Objective does not exist');
                    return;
                }

                dataContext.objectives = _.reject(dataContext.objectives, function (item) {
                    return item.id == id;
                });

                deferred.resolve();
            });

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

                    var
                        objectiveId = response.data.Id,
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
        }
        ;

        return {
            getById: getById,
            getCollection: getCollection,

            addObjective: addObjective,
            removeObjective: removeObjective,

            update: update
        };
    }
);