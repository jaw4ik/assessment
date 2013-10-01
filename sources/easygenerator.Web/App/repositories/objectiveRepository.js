define(['dataContext', 'constants', 'httpWrapper', 'guard', 'models/objective'],
    function (dataContext, constants, httpWrapper, guard, objectiveModel) {


        var
            getCollection = function () {
                return Q.fcall(function () {
                    return dataContext.objectives;
                });
            },

            getById = function (id) {
                return Q.fcall(function () {
                    guard.throwIfNotString(id, 'Invalid argument');

                    var result = _.find(dataContext.objectives, function (item) {
                        return item.id === id;
                    });

                    guard.throwIfNotAnObject(result, 'Objective does not exist');

                    return result;
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

                    return httpWrapper.post('api/objective/update', { objectiveId: obj.id, title: obj.title }).then(function (response) {

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
            }
        ;

        return {
            getById: getById,
            getCollection: getCollection,

            addObjective: addObjective,
            removeObjective: removeObjective,

            updateObjective: updateObjective,
        };
    }
);