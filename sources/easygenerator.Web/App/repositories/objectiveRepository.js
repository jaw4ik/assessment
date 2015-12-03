define(['dataContext', 'constants', 'http/apiHttpWrapper', 'guard', 'models/objective', 'durandal/app'],
    function (dataContext, constants, apiHttpWrapper, guard, objectiveModel, app) {
        "use strict";

        var repository = {
            getById: getById,
            getCollection: getCollection,
            addObjective: addObjective,
            removeObjective: removeObjective,
            updateTitle: updateTitle,
            updateImage: updateImage,
            updateQuestionsOrder: updateQuestionsOrder
        };

        return repository;

        function getCollection() {

            return Q.fcall(function () {
                return dataContext.objectives;
            });
        }

        function getById(id) {
            return Q.fcall(function () {
                guard.throwIfNotString(id, 'Objective id (string) was expected');

                var result = _.find(dataContext.objectives, function (item) {
                    return item.id === id;
                });

                guard.throwIfNotAnObject(result, 'Objective with this id is not found');

                return result;
            });
        }

        function addObjective(objective) {
            return Q.fcall(function () {
                guard.throwIfNotAnObject(objective, 'Objective data is not an object');

                return apiHttpWrapper.post('api/objective/create', objective).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.Id, 'Objective Id is not a string');
                    guard.throwIfNotString(response.ImageUrl, 'Objective ImageUrl is not a string');
                    guard.throwIfNotString(response.CreatedOn, 'Objective creation date is not a string');
                    guard.throwIfNotString(response.CreatedBy, 'Objective createdBy is not a string');
                    
                    var
                        createdObjective = new objectiveModel({
                            id: response.Id,
                            title: objective.title,
                            image: response.ImageUrl,
                            questions: [],
                            createdOn: new Date(response.CreatedOn),
                            createdBy: response.CreatedBy,
                            modifiedOn: new Date(response.CreatedOn)
                        });

                    dataContext.objectives.push(createdObjective);

                    return createdObjective;
                });
            });
        }

        function updateTitle(objectiveId, title) {
            return Q.fcall(function () {
                guard.throwIfNotString(objectiveId, 'Objective data has invalid format');
                guard.throwIfNotString(title, 'Objective data has invalid format');

                return apiHttpWrapper.post('api/objective/updatetitle', { objectiveId: objectiveId, title: title }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var objective = _.find(dataContext.objectives, function (item) {
                        return item.id === objectiveId;
                    });

                    guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                    objective.title = title;
                    objective.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.objective.titleUpdated, objective);

                    return objective.modifiedOn;
                });
            });
        }

        function updateImage(objectiveId, imageUrl) {
            return Q.fcall(function () {
                guard.throwIfNotString(objectiveId, 'Objective data has invalid format');
                guard.throwIfNotString(imageUrl, 'Objective data has invalid format');

                imageUrl += '?width=120&height=120&scaleBySmallerSide=true';

                return apiHttpWrapper.post('api/objective/updateimage', { objectiveId: objectiveId, imageUrl: imageUrl }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var objective = _.find(dataContext.objectives, function (item) {
                        return item.id === objectiveId;
                    });

                    guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                    objective.image = imageUrl;
                    objective.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.objective.imageUrlUpdated, objective);

                    return {
                        modifiedOn: objective.modifiedOn,
                        imageUrl: imageUrl
                    };
                });
            });
        }

        function removeObjective(objectiveId) {
            return Q.fcall(function () {
                guard.throwIfNotString(objectiveId, 'Objective id was expected');

                return apiHttpWrapper.post('api/objective/delete', { objectiveId: objectiveId }).then(function () {
                    dataContext.objectives = _.reject(dataContext.objectives, function (objective) {
                        return objective.id == objectiveId;
                    });
                });
            });
        }

        function updateQuestionsOrder(objectiveId, questions) {
            return Q.fcall(function () {
                guard.throwIfNotString(objectiveId, 'Objective id (string) was expected');
                guard.throwIfNotArray(questions, 'Questions is not array');

                var requestArgs = {
                    objectiveId: objectiveId,
                    questions: _.map(questions, function (item) {
                        return item.id;
                    })
                };

                return apiHttpWrapper.post('api/objective/updatequestionsorder', requestArgs).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var objective = _.find(dataContext.objectives, function (item) {
                        return item.id === objectiveId;
                    });

                    guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                    objective.questions = _.map(questions, function (question) {
                        return _.find(objective.questions, function (item) {
                            return item.id == question.id;
                        });
                    });

                    objective.modifiedOn = new Date(response.ModifiedOn);

                    app.trigger(constants.messages.objective.questionsReordered, objective);

                    return {
                        modifiedOn: objective.modifiedOn
                    };
                });
            });
        }

    }
);