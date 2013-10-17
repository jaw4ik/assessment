define(['dataContext', 'httpWrapper', 'guard', 'models/learningObject'],
    function (dataContext, httpWrapper, guard, learningObjectModel) {

        var
            getCollection = function (questionId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');

                    return httpWrapper.post('api/learningObjects', { questionId: questionId }).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotArray(response.LearningObjects, 'Learning objects is not an array');
                        
                        return _.map(response.LearningObjects, function (learningObject) {
                            return new learningObjectModel({
                                id: learningObject.Id,
                                text: learningObject.Text,
                            });
                        });
                    });
                });
            },

            getById = function (id) {
                return Q.fcall(function () {
                    guard.throwIfNotString(id, 'Learning object id is not a string');
                    var context = getQuestionAndLearningObject(id);
                    return context == null ? null : context.learningObject;
                });
            },

            addLearningObject = function (questionId, learningObject) {

                return Q.fcall(function () {

                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotAnObject(learningObject, 'Learning object data is not an object');
                    guard.throwIfNotString(learningObject.text, 'Learning object text is not a string');

                    var data = {
                        questionId: questionId,
                        text: learningObject.text
                    };

                    return httpWrapper.post('api/learningObject/create', data).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.Id, 'Learning object id is not a string');
                        guard.throwIfNotString(response.CreatedOn, 'Learning object creation date is not a string');

                        var question = getQuestion(questionId);

                        guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                        var createdOn = new Date(parseInt(response.CreatedOn.substr(6), 10));

                        question.modifiedOn = createdOn;
                        question.learningObjects.push({
                            id: response.Id,
                            text: learningObject.text,
                            createdOn: createdOn,
                            modifiedOn: createdOn
                        });

                        return { id: response.Id, createdOn: createdOn };

                    });

                });

            },

            removeLearningObject = function (questionId, learningObjectId) {
                return Q.fcall(function () {

                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotString(learningObjectId, 'Learning object id is not a string');

                    var data = {
                        questionId: questionId,
                        learningObjectId: learningObjectId
                    };

                    return httpWrapper.post('api/learningObject/delete', data).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                        var question = getQuestion(questionId);

                        guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                        question.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));
                        question.learningObjects = _.reject(question.learningObjects, function (item) {
                            return item.id == learningObjectId;
                        });

                        return question.modifiedOn;
                    });

                });
            },

            updateText = function (learningObjectId, text) {
                return Q.fcall(function () {
                    guard.throwIfNotString(learningObjectId, 'Learning object id is not a string');
                    guard.throwIfNotString(text, 'Learning object text is not a string');

                    var data = { learningObjectId: learningObjectId, text: text };

                    return httpWrapper.post('api/learningObject/updateText', data).then(function (response) {

                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Learning object modification date is not a string');

                        var context = getQuestionAndLearningObject(learningObjectId);
                        guard.throwIfNotAnObject(context, 'Learning object does not exist in dataContext');

                        var modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                        context.learningObject.text = text;
                        context.learningObject.modifiedOn = modifiedOn;
                        context.question.modifiedOn = modifiedOn;

                        return modifiedOn;
                    });

                });
            }

        ;

        function updateQuestionModifiedOnDate(questionId, modifiedOn) {
            var question = getQuestion(questionId);
            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');
            question.modifiedOn = modifiedOn;
        }

        function getQuestions() {
            var questions = [];
            _.each(dataContext.objectives, function (objective) {
                questions.push.apply(questions, objective.questions);
            });
            return questions;
        }

        function getQuestion(questionId) {
            return _.find(getQuestions(), function (item) {
                return item.id == questionId;
            });
        }

        function getQuestionAndLearningObject(learningObjectId) {
            var questions = getQuestions();

            for (var i = 0; i < questions.length; i++) {

                var learningObject = _.find(questions[i].learningObjects, function (item) {
                    return item.id === learningObjectId;
                });

                if (learningObject != null) {
                    return { question: questions[i], learningObject: learningObject };
                }
            }

            return null;
        }

        return {
            getCollection: getCollection,
            getById: getById,

            addLearningObject: addLearningObject,
            removeLearningObject: removeLearningObject,

            updateText: updateText
        };
    });