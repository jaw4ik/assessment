define(['dataContext', 'httpWrapper', 'guard', 'repositories/objectiveRepository', 'durandal/system'], function (dataContext, httpWrapper, guard, objectiveRepository, system) {

    var
        addQuestion = function (objectiveId, obj) {
            return Q.fcall(function () {

                guard.throwIfNotString(objectiveId, 'Objective id is not a string');
                guard.throwIfNotAnObject(obj, 'Question data is not an object');

                return httpWrapper.post('api/question/create', { objectiveId: objectiveId, title: obj.title })
                    .then(function (response) {

                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.Id, 'Question Id is not a string');
                        guard.throwIfNotString(response.CreatedOn, 'Question creation date is not a string');


                        var objective = _.find(dataContext.objectives, function (item) {
                            return item.id === objectiveId;
                        });

                        guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                        var createdOn = new Date(parseInt(response.CreatedOn.substr(6), 10));

                        objective.modifiedOn = createdOn;

                        objective.questions.push({
                            id: response.Id,
                            title: obj.title,
                            explanations: [],
                            answerOptions: [],
                            createdOn: createdOn,
                            modifiedOn: createdOn
                        });

                        return response.Id;
                    });
            });

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
                return item.id === questionId;
            });

            deferred.resolve(question);
        });

        return deferred.promise;
    }
    ;
    return {
        addQuestion: addQuestion,
        update: update,
        getById: getById
    };
});
