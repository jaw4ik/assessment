define(['dataContext', 'httpWrapper', 'guard'],
    function (dataContext, httpWrapper, guard) {

        var
            getById = function (id) {
                return Q.fcall(function () {
                    guard.throwIfNotString(id, 'Answer id is not a string');
                    var context = getAnswerAndQuestion(id);
                    return context == null ? null : context.answer;
                });
            },

            addAnswer = function (questionId, answer) {

                return Q.fcall(function () {

                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotAnObject(answer, 'Answer data is not an object');
                    guard.throwIfNotString(answer.text, 'Answer data text is not a string');
                    guard.throwIfNotBoolean(answer.isCorrect, 'Answer data correctness is not a boolean');

                    var data = {
                        questionId: questionId,
                        text: answer.text,
                        isCorrect: answer.isCorrect
                    };

                    return httpWrapper.post('api/answer/create', data).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.Id, 'Answer id is not a string');
                        guard.throwIfNotString(response.CreatedOn, 'Answer creation date is not a string');

                        var question = getQuestion(questionId);

                        guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                        var createdOn = new Date(parseInt(response.CreatedOn.substr(6), 10));

                        question.modifiedOn = createdOn;
                        question.answerOptions.push({
                            id: response.Id,
                            text: answer.text,
                            isCorrect: answer.isCorrect,
                            createdOn: createdOn,
                            modifiedOn: createdOn
                        });

                        return { id: response.Id, createdOn: createdOn };

                    });

                });

            },

            removeAnswer = function (questionId, answerId) {
                return Q.fcall(function () {

                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotString(answerId, 'Answer id is not a string');

                    var data = {
                        questionId: questionId,
                        answerId: answerId
                    };

                    return httpWrapper.post('api/answer/delete', data).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                        var question = getQuestion(questionId);

                        guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                        question.modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));
                        question.answerOptions = _.reject(question.answerOptions, function (item) {
                            return item.id == answerId;
                        });

                        return question.modifiedOn;
                    });

                });
            },

            updateText = function (answerId, text) {
                return Q.fcall(function () {
                    guard.throwIfNotString(answerId, 'Answer id is not a string');
                    guard.throwIfNotString(text, 'Answer text is not a string');

                    var data = { answerId: answerId, text: text };

                    return httpWrapper.post('api/answer/updateText', data).then(function (response) {

                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Answer modification date is not a string');

                        var context = getAnswerAndQuestion(answerId);
                        guard.throwIfNotAnObject(context, 'Answer does not exist in dataContext');

                        var modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                        context.answer.text = text;
                        context.answer.modifiedOn = modifiedOn;
                        context.question.modifiedOn = modifiedOn;

                        return modifiedOn;
                    });

                });
            },

            updateCorrectness = function (answerId, isCorrect) {
                return Q.fcall(function () {
                    guard.throwIfNotString(answerId, 'Answer id is not a string');
                    guard.throwIfNotBoolean(isCorrect, 'Answer correctness is not a boolean');

                    var data = { answerId: answerId, isCorrect: isCorrect };

                    return httpWrapper.post('api/answer/updateCorrectness', data).then(function (response) {

                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Answer modification date is not a string');

                        var context = getAnswerAndQuestion(answerId);
                        guard.throwIfNotAnObject(context, 'Answer does not exist in dataContext');

                        var modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));

                        context.answer.isCorrect = isCorrect;
                        context.answer.modifiedOn = modifiedOn;
                        context.question.modifiedOn = modifiedOn;

                        return modifiedOn;
                    });

                });
            }
        ;

        function getAnswerAndQuestion(answerId) {
            var questions = getQuestions();

            for (var i = 0; i < questions.length; i++) {

                var answer = _.find(questions[i].answerOptions, function (item) {
                    return item.id === answerId;
                });

                if (answer != null) {
                    return {
                        question: questions[i],
                        answer: answer
                    };
                }
            }

            return null;
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

        return {
            getById: getById,

            addAnswer: addAnswer,
            removeAnswer: removeAnswer,

            updateText: updateText,
            updateCorrectness: updateCorrectness
        };
    });