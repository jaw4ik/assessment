﻿define(['dataContext', 'plugins/http', 'models/objective', 'configuration/images', 'repositories/objectiveBriefRepository'],
    function (dataContext, http, objectiveModel, images, objectiveBriefRepository) {

        var self = {};

        self.getCollection = function () {
            var deferred = Q.defer();

            deferred.resolve(dataContext.objectives);

            return deferred.promise;
        };

        self.getById = function (id) {
            var deferred = Q.defer();

            deferred.resolve(_.find(dataContext.objectives, function (item) {
                return item.id == id;
            }));

            return deferred.promise;
        };

        self.update = function (obj) {
            var deferred = Q.defer();

            deferred.resolve(true);

            return deferred.promise;
        };

        self.add = function (objectiveTitle) {
            var deferred = Q.defer();

            var maxId = _.max(_.map(dataContext.objectives, function (exp) {
                return parseInt(exp.id);
            }));

            var objective = {
                id: maxId + 1,
                title: objectiveTitle,
                image: images[0],
                questions: [],
                createdOn: Date.now(),
                modifiedOn: Date.now()
            };

            dataContext.objectives.push(new objectiveModel(objective));

            objectiveBriefRepository.getCollection().then(function(collection) {
                collection.push({
                    id: objective.id,
                    title: objective.title,
                    image: objective.image,
                    questionsCount: objective.questions.length
                });
            });

            deferred.resolve(objective);

            return deferred.promise;
        };

        var
            addObjective = function (objective) {
                var deferred = Q.defer();

                if (_.isUndefined(objective)) {
                    deferred.reject('Objective data is undefined');
                }

                if (_.isNull(objective)) {
                    deferred.reject('Objective data is null');
                }

                http.post('objective/create', objective)
                    .done(function (response) {
                        if (_.isUndefined(response)) {
                            deferred.reject('Response is undefined');
                            return;
                        }
                        if (_.isNull(response)) {
                            deferred.reject('Response is null');
                            return;
                        }

                        if (!response.isSuccessful) {
                            deferred.reject('Response is not successful');
                            return;
                        }
                        if (_.isUndefined(response.objectiveId)) {
                            deferred.reject('Objective Id is undefined');
                            return;
                        }
                        if (_.isNull(response.objectiveId)) {
                            deferred.reject('Objective Id is null');
                            return;
                        }

                        dataContext.objectives.push(objectiveModel({ id: response.objectiveId, title: objective.title, questions: [] }));
                        deferred.resolve(response.objectiveId);
                    })
                    .fail(function (reason) {
                        deferred.reject(reason);
                    });


                return deferred.promise;
            }
        ;

        return {
            getById: self.getById,
            getCollection: self.getCollection,

            addObjective: addObjective,
            updateObjective: null,
            removeObjective: null,

            update: self.update,

            add: self.add
        };
    }
);