define(['./models/actor', './models/statement', './models/activity', './configuration/xApiSettings', 'eventManager', './constants', './errorsHandler', './utils/dateTimeConverter', 'xApi/statementQueue'],
    function (actorModel, statementModel, activityModel, xApiSettings, eventManager, constants, errorsHandler, dateTimeConverter, statementQueue) {
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

                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseStarted).then(enqueueCourseStarted));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseFinished).then(enqueueCourseFinished));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.learningContentExperienced).then(learningContentExperienced));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.answersSubmitted).then(enqueueAnsweredQuestionsStatements));
            });

        }

        function turnOffSubscriptions() {
            _.each(subscriptions, function (subscription) {
                if (!_.isNullOrUndefined(subscription && subscription.off)) {
                    subscription.off();
                }
            });
        }

        function enqueueCourseStarted() {
            pushStatementIfSupported(createStatement(constants.verbs.started));
        }

        function pushStatementIfSupported(statement) {
            if (_.contains(xApiSettings.xApi.allowedVerbs, statement.verb.display[xApiSettings.defaultLanguage])) {
                statementQueue.enqueue(statement);
            }
        }

        function enqueueCourseFinished(finishedEventData) {
            enqueueObjectivesFinished(finishedEventData.objectives);

            var result = {
                score: finishedEventData.result
            };

            var verb = result.score >= xApiSettings.scoresDistribution.minScoreForPositiveResult ? xApiSettings.scoresDistribution.positiveVerb : constants.verbs.failed;

            pushStatementIfSupported(createStatement(verb, result, createActivity(activityProvider.activityName)));
            pushStatementIfSupported(createStatement(constants.verbs.stopped, null, createActivity(activityProvider.activityName)));

            // (^\ x_x /^)
            statementQueue.enqueue(undefined);

            var dfd = Q.defer();

            statementQueue.statements.subscribe(function (newValue) {
                if (newValue.length == 0) {
                    dfd.resolve();
                }
            });

            return dfd.promise;
        }

        function enqueueObjectivesFinished(objectives) {
            _.each(objectives, function (objective) {
                var statement = createStatement(constants.verbs.mastered, { score: objective.score / 100 }, createActivityForObjective(objective.id, objective.title));
                pushStatementIfSupported(statement);
            });
        }

        function learningContentExperienced(finishedEventData) {
            var result = {
                duration: dateTimeConverter.timeToISODurationString(finishedEventData.spentTime)
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
            pushStatementIfSupported(statement);
        }

        function enqueueAnsweredQuestionsStatements(finishedEventData) {
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
                pushStatementIfSupported(statement);
            });
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