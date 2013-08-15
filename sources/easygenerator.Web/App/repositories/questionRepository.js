﻿define(['dataContext', 'repositories/objectiveRepository'], function (dataContext, objectiveRepository) {

    var self = {};

    self.create = function (objectiveId, obj) {
        if (_.isNullOrUndefined(objectiveId) || _.isNullOrUndefined(obj))
            throw 'Invalid arguments';

        if (_.isNullOrUndefined(obj.title))
            throw 'Question title is null or undefined';

        var deferred = Q.defer();

        objectiveRepository.getById(objectiveId).then(function (objective) {
            if (!_.isObject(objective))
                deferred.reject('Objective does not exist');

            var question = {
                id: self.generateNewEntryId(objective.questions),
                title: obj.title
            };

            objective.questions.push(question);
            deferred.resolve(question);
        });
        
        return deferred.promise;
    };

    self.generateNewEntryId = function (collection) {
        var id = 0;
        if (collection.length > 0) {
            var maxId = _.max(_.map(collection, function (exp) {
                return parseInt(exp.id);
            }));

            id = maxId + 1;
        }

        return id;
    };

    return {
        create: self.create
    };
});
