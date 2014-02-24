﻿define(['./models/actor', './models/statement', './models/activity', './configuration/xApiSettings', 'eventManager', './requestManager', './constants', './errorsHandler', './utils/dateTimeConverter'],
    function (actorModel, statementModel, activityModel, xApiSettings, eventManager, requestManager, constants, errorsHandler, dateTimeConverter) {
        "use strict";

        var subscriptions = [],
            activityProvider = {
                actor: null,
                activityName: null,
                init: init,
                createActor: createActor,
                rootCourseUrl: null,
                rootActivityUrl: null,
                turnOffSubscriptions: turnOffSubscriptions
            };

        return activityProvider;

        function init(actorData, activityName, activityUrl) {
            return Q.fcall(function () {
                if (_.isUndefined(xApiSettings.scoresDistribution.minScoreForPositiveResult) || _.isUndefined(xApiSettings.scoresDistribution.positiveVerb)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }

                activityProvider.actor = actorData;
                activityProvider.activityName = activityName;
                activityProvider.rootCourseUrl = activityUrl.split("?")[0].split("#")[0];
                activityProvider.rootActivityUrl = activityProvider.rootCourseUrl + '#questions';

                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseStarted).then(sendCourseStarted));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseFinished).then(sendCourseFinished));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.learningContentExperienced).then(learningContentExperienced));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.answersSubmitted).then(sendAnsweredQuestionsStatements));
            });

        }

        function turnOffSubscriptions() {
            _.each(subscriptions, function (subscription) {
                if (!_.isNullOrUndefined(subscription && subscription.off)) {
                    subscription.off();
                }
            });
        }

        function sendCourseStarted() {
            var statement = createStatement(constants.verbs.started);
            requestManager.sendStatement(statement);
        }

        function sendCourseFinished(finishedEventData) {
            var activity = createActivity(activityProvider.activityName);
            return sendMasteredStatementsForObjectives(finishedEventData).then(function () {
                if (_.isUndefined(finishedEventData) || _.isUndefined(finishedEventData.result)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }

                var result = {
                    score: finishedEventData.result
                };

                if (result.score >= xApiSettings.scoresDistribution.minScoreForPositiveResult) {
                    return requestManager.sendStatement(createStatement(xApiSettings.scoresDistribution.positiveVerb, result, activity));
                } else {
                    return requestManager.sendStatement(createStatement(constants.verbs.failed, result, activity));
                }
            }).then(function () {
                return requestManager.sendStatement(createStatement(constants.verbs.stopped, null, activity));
            }).fail(function (error) {
                errorsHandler.handleError(error);
            });
        }

        function sendMasteredStatementsForObjectives(finishedEventData) {
            if (!_.isUndefined(finishedEventData.objectives) && _.isArray(finishedEventData.objectives) && finishedEventData.objectives.length > 0) {
                var promises = [];
                var objectives = finishedEventData.objectives;
                _.each(objectives, function (objective) {
                    var activity = createActivityForObjective(objective.id, objective.title);
                    var statement = createStatement(constants.verbs.mastered, { score: objective.score / 100 }, activity);
                    promises.push(requestManager.sendStatement(statement));
                });
                return Q.allSettled(promises);
            }
            return Q.fcall(function () { });
        }

        function learningContentExperienced(finishedEventData) {
            var result =
            {
                duration: dateTimeConverter.timeToISODurationString(finishedEventData.spentTime),
            };

            var learningContentUrl = activityProvider.rootCourseUrl + '#objective/' + finishedEventData.objective.id + '/question/' + finishedEventData.question.id + '/learningContents';
            var object = createActivity(finishedEventData.question.title, learningContentUrl);

            var context = {
                contextActivities: {
                    parent: [createActivityForQuestion(finishedEventData.question.id, finishedEventData.question.title)],
                    grouping: [createActivityForObjective(finishedEventData.objective.id, finishedEventData.objective.title)]
                }
            };

            var statement = createStatement(constants.verbs.experienced, result, object, context);
            requestManager.sendStatement(statement);
        }

        function sendAnsweredQuestionsStatements(finishedEventData) {
            var promises = [];

            _.each(finishedEventData, function (item) {
                var question = item.question;
                var objective = item.objective;

                var result = {
                    score: question.score / 100,
                    response: question.selectedAnswersIds.toString()
                };

                var object = {
                    id: getActiviryUrlForQuestion(question.id),
                    definition: {
                        name: {
                            "en-US": question.title
                        },
                        type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                        interactionType: "choice",
                        correctResponsesPattern: question.correctAnswersIds,
                        choices: _.map(question.answers, function (answer) {
                            return {
                                id: answer.id,
                                description: {
                                    "en-US": answer.text
                                }
                            };
                        })
                    }
                };

                var context = {
                    contextActivities: {
                        parent: [createActivityForObjective(objective.id, objective.title)]
                    }
                };

                var statement = createStatement(constants.verbs.answered, result, object, context);
                promises.push(requestManager.sendStatement(statement));
            });

            return Q.allSettled(promises);
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

        function createActivity(name, id) {
            return activityModel({
                id: id || activityProvider.rootActivityUrl,
                definition: {
                    name: {
                        "en-US": name
                    }
                }
            });
        }

        function createStatement(verb, result, activity, context) {
            var activityData = activity || createActivity(activityProvider.activityName);

            return statementModel({
                actor: activityProvider.actor,
                verb: verb,
                object: activityData,
                result: result,
                context: context
            });
        }

        function getActiviryUrlForQuestion(questionId) {
            return activityProvider.rootActivityUrl + '?questionid=' + questionId;
        }

        function createActivityForQuestion(questionId, questionTitle) {
            var activityId = getActiviryUrlForQuestion(questionId);
            return createActivity(questionTitle, activityId);
        }

        function createActivityForObjective(objectiveId, objectiveTitle) {
            var activityId = activityProvider.rootActivityUrl + '?objectiveid=' + objectiveId;
            return createActivity(objectiveTitle, activityId);
        }
    }
);