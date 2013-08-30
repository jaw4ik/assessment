define(['dataContext', 'repositories/objectiveRepository'], function (dataContext, objectiveRepository) {

    var add = function (objectiveId, obj) {
        if (_.isNullOrUndefined(objectiveId) || _.isNullOrUndefined(obj))
            throw 'Invalid arguments';

        var deferred = Q.defer();

        objectiveRepository.getById(objectiveId).then(function (objective) {
            if (!_.isObject(objective))
                deferred.reject('Objective does not exist');

            var question = {
                id: generateNewEntryId(objective.questions),
                title: obj.title,
                explanations: [],
                answerOptions: [],
                createdOn: new Date(),
                modifiedOn: new Date()
            };

            objective.questions.push(question);
            objective.modifiedOn = new Date();

            deferred.resolve(question.id);
        });

        return deferred.promise;
    },

    update = function (objectiveId, obj) {
        if (_.isNullOrUndefined(objectiveId) || _.isNullOrUndefined(obj))
            throw 'Invalid arguments';

        var deferred = Q.defer();

        objectiveRepository.getById(objectiveId).then(function (objective) {
            if (!_.isObject(objective)) {
                deferred.reject('Objective does not exist');
                return;
            }

            var question = _.find(objective.questions, function (item) {
                return item.id === obj.id;
            });

            if (!_.isObject(question)) {
                deferred.reject('Question does not exist');
                return;
            }

            question.title = obj.title;
            question.modifiedOn = new Date();

            deferred.resolve(question);
        });

        return deferred.promise;
    },

    getById = function (objectiveId, questionId) {
        if (_.isNullOrUndefined(objectiveId) || _.isNullOrUndefined(questionId))
            throw 'Invalid arguments';

        var deferred = Q.defer();

        objectiveRepository.getById(objectiveId).then(function (objective) {
            if (!_.isObject(objective))
                deferred.reject('Objective does not exist');

            var question = _.find(objective.questions, function (item) {
                return item.id == questionId;
            });

            deferred.resolve(question);
        });

        return deferred.promise;
    },

    generateNewEntryId = function (collection) {
        var id = 0;
        if (collection.length > 0) {
            var maxId = _.max(_.map(collection, function (exp) {
                return parseInt(exp.id, 10);
            }));

            id = maxId + 1;
        }

        return id;
    };

    return {
        add: add,
        update: update,
        getById: getById
    };
});
