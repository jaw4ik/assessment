define(['dataContext', 'constants', 'httpWrapper', 'guard', 'models/objective'],
    function (dataContext, constants, httpWrapper, guard, objectiveModel) {
        var
            getCollection = function () {
                return Q.fcall(function () {
                    return httpWrapper.post('api/objectives').then(function () {
                        return dataContext.objectives;
                    });
                });
            },

            getById = function (id) {
                return Q.fcall(function () {
                    var deferred = Q.defer();
                    guard.throwIfNotString(id, 'Objective id (string) was expected');

                    httpWrapper.post('api/objectives').then(function () {
                        var result = _.find(dataContext.objectives, function (item) {
                            return item.id === id;
                        });

                        if (_.isUndefined(result)) {
                            deferred.reject('Objective with this id is not found');
                            return;
                        };

                        deferred.resolve(result);
                    });

                    return deferred.promise;
                });
            },

            addObjective = function (objective) {
                return Q.fcall(function () {

                    guard.throwIfNotAnObject(objective, 'Objective data is not an object');

                    return httpWrapper.post('api/objective/create', objective)
                        .then(function (response) {

                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.Id, 'Objective Id is not a string');
                            guard.throwIfNotString(response.CreatedOn, 'Objective creation date is not a string');

                            var
                                createdObjective = objectiveModel({
                                    id: response.Id,
                                    title: objective.title,
                                    image: constants.defaultObjectiveImage,
                                    questions: [],
                                    createdOn: new Date(parseInt(response.CreatedOn.substr(6), 10)),
                                    modifiedOn: new Date(parseInt(response.CreatedOn.substr(6), 10))
                                });

                            dataContext.objectives.push(createdObjective);

                            return {
                                id: createdObjective.id,
                                createdOn: createdObjective.createdOn
                            };
                        });
                });
            },

            updateObjective = function (obj) {
                return Q.fcall(function () {

                    guard.throwIfNotAnObject(obj, 'Objective data has invalid format');
                    guard.throwIfNotString(obj.id, 'Objective data has invalid format');
                    guard.throwIfNotString(obj.title, 'Objective data has invalid format');

                    return httpWrapper.post('api/objective/update', { objectiveId: obj.id, title: obj.title })
                        .then(function (response) {

                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var objective = _.find(dataContext.objectives, function (item) {
                                return item.id === obj.id;
                            });

                            guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                            objective.title = obj.title;
                            objective.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                            return objective.modifiedOn;
                        });
                });
            },

            removeObjective = function (objectiveId) {
                return Q.fcall(function () {

                    guard.throwIfNotString(objectiveId, 'Objective id was expected');

                    return httpWrapper.post('api/objective/delete', { objectiveId: objectiveId })
                        .then(function () {
                            dataContext.objectives = _.reject(dataContext.objectives, function (objective) {
                                return objective.id == objectiveId;
                            });
                        });
                });
            },

            updateQuestionsOrder = function (objectiveId, questions) {
                return Q.fcall(function () {
                    guard.throwIfNotString(objectiveId, 'Objective id (string) was expected');
                    guard.throwIfNotArray(questions, 'Questions is not array');

                    var requestArgs = {
                        objectiveId: objectiveId,
                        questions: _.map(questions, function (item) {
                            return item.id;
                        })
                    };

                    return httpWrapper.post('api/objective/updatequestionsorder', requestArgs)
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var objective = _.find(dataContext.objectives, function (item) {
                                return item.id === objectiveId;
                            });

                            guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                            objective.questions = _.map(questions, function(question) {
                                return _.find(objective.questions, function(item) {
                                    return item.id == question.id;
                                });
                            });

                            objective.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));
                            return { modifiedOn: objective.modifiedOn };
                        });
                });
            };

        return {
            getById: getById,
            getCollection: getCollection,

            addObjective: addObjective,
            removeObjective: removeObjective,

            updateObjective: updateObjective,
            updateQuestionsOrder: updateQuestionsOrder
        };
    }
);