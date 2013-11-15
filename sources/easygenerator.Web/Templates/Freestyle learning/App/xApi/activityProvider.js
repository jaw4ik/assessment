define(['xApi/models/actor', 'xApi/models/statement', 'xApi/models/activity', 'xApi/settings', 'eventManager', 'xApi/requestManager', 'xApi/constants', 'xApi/errorsHandler', 'xApi/models/result', 'xApi/models/score', 'xApi/models/context', 'xApi/models/contextActivities', 'xApi/utils/dateTimeConverter'],
    function (actorModel, statementModel, activityModel, xApiSettings, eventManager, requestManager, constants, errorsHandler, resultModel, scoreModel, contextModel, contextActivitiesModel, dateTimeConverter) {
        "use strict";

        var
            activityProvider = {
                actor: null,
                activityName: null,
                activityUrl: null,
                init: init,
                createActor: createActor,
                rootCourseUrl: null
            };

        return activityProvider;

        function init(actorData, activityName, activityUrl) {
            return Q.fcall(function () {
                return requestManager.init();
            }).then(function () {
                if (_.isUndefined(xApiSettings.scoresDistribution.minScoreForPositiveResult) || _.isUndefined(xApiSettings.scoresDistribution.positiveVerb)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }
                
                activityProvider.actor = actorData;
                activityProvider.activityName = activityName;
                activityProvider.activityUrl = activityUrl;
                activityProvider.rootCourseUrl = activityUrl != undefined ? activityUrl.split("?")[0].split("#")[0] : '';

                eventManager.subscribeForEvent(eventManager.events.courseStarted).then(function () {
                    return sendCourseStarted();
                });

                eventManager.subscribeForEvent(eventManager.events.courseFinished).then(function (finishedEventData) {
                    return sendCourseFinished(finishedEventData);
                });

                eventManager.subscribeForEvent(eventManager.events.learningContentExperienced).then(function (finishedEventData) {
                    return learningContentExperienced(finishedEventData);
                });

                eventManager.subscribeForEvent(eventManager.events.questionSubmitted).then(function (finishedEventData) {
                    return sendAnsweredQuestionsStatements(finishedEventData);
                });
            });

        }

        function sendCourseStarted() {
            var statement = createStatement(constants.verbs.started);
            return requestManager.sendStatement(statement);
        }

        function sendCourseFinished(finishedEventData) {
            return sendMasteredStatementsForObjectives(finishedEventData.objectives).then(function () {
                if (_.isUndefined(finishedEventData) || _.isUndefined(finishedEventData.result)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }

                var result = new resultModel({
                    score: new scoreModel(finishedEventData.result)
                });

                if (result.score >= xApiSettings.scoresDistribution.minScoreForPositiveResult) {
                    return requestManager.sendStatement(createStatement(xApiSettings.scoresDistribution.positiveVerb, result));
                } else {
                    return requestManager.sendStatement(createStatement(constants.verbs.failed, result));
                }
            }).then(function () {
                return requestManager.sendStatement(createStatement(constants.verbs.stopped));
            }).then(function () {
                if (!!finishedEventData.callback) {
                    finishedEventData.callback.call(this);
                }
            }).fail(function (error) {
                errorsHandler.handleError(error);
            });
        }

        function sendMasteredStatementsForObjectives(objectives) {
            if (!_.isUndefined(objectives) && _.isArray(objectives) && objectives.length > 0) {
                var promises = _.map(objectives, function (objective) {
                    var objectiveUrl = activityProvider.rootCourseUrl + '#home?objectiveid=' + objective.id;
                    var object = createActivity(objectiveUrl, objective.title);
                    var statement = createStatement(constants.verbs.mastered, new resultModel({ score: new scoreModel(objective.score / 100) }), object);
                    return requestManager.sendStatement(statement);
                });

                return Q.allSettled(promises);
            }
            return Q.fcall(function () { });
        }

        function learningContentExperienced(finishedEventData) {
            var result = new resultModel({
                duration: dateTimeConverter.timeToISODurationString(finishedEventData.spentTime),
            });

            var learningContentUrl = activityProvider.rootCourseUrl + '#objective/' + finishedEventData.objective.id + '/question/' + finishedEventData.question.id + '/learningContents';
            var parentUrl = activityProvider.rootCourseUrl + '#objective/' + finishedEventData.objective.id + '/question/' + finishedEventData.question.id;
            var groupingUrl = activityProvider.rootCourseUrl + '#home?objectiveid=' + finishedEventData.objective.id;
            var object = createActivity(learningContentUrl, finishedEventData.question.title);

            var context = new contextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, finishedEventData.question.title)],
                    grouping: [createActivity(groupingUrl, finishedEventData.objective.title)]
                })
            });

            var statement = createStatement(constants.verbs.experienced, result, object, context);
            return requestManager.sendStatement(statement);
        }

        function sendAnsweredQuestionsStatements(finishedEventData) {
            var question = finishedEventData.question;
            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = new resultModel({
                score: new scoreModel(question.getScore() / 100),
                response: question.getSelectedAnswersId().toString()
            });

            var object = new activityModel({
                id: questionUrl,
                definition: {
                    name: {
                        "en-US": question.title
                    },
                    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                    interactionType: "choice",
                    correctResponsesPattern: question.getCorrectAnswersIds(),
                    choices: _.map(question.answers, function (item) {
                        return {
                            id: item.id,
                            description: {
                                "en-US": item.text
                            }
                        };
                    })
                }
            });

            var parentUrl = activityProvider.rootCourseUrl + '#home?objectiveid=' + question.objectiveId;

            var context = new contextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, question.objectiveTitle)]
                })
            });

            var statement = createStatement(constants.verbs.answered, result, object, context);

            return requestManager.sendStatement(statement);
        }

        function createActor(name, email) {
            var actor = {};

            try {
                actor = actorModel({
                    name: name,
                    mbox: 'mailto:' + email
                });
            } catch (e) {
                errorsHandler.handleError(errorsHandler.errors.actorDataIsIncorrect);
            }

            return actor;
        }

        function createActivity(id, name) {
            return activityModel({
                id: id || activityProvider.activityUrl,
                definition: {
                    name: {
                        "en-US": name
                    }
                }
            });
        }

        function createStatement(verb, result, activity, context) {
            var activityData = activity || createActivity(null, activityProvider.activityName);

            return statementModel({
                actor: activityProvider.actor,
                verb: verb,
                object: activityData,
                result: result,
                context: context
            });
        }
    }
);