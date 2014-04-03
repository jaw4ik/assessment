define(['./models/actor', './models/statement', './models/activity', 'eventManager', './errorsHandler', './configuration/xApiSettings', './constants', './models/result', './models/score', './models/context', './models/contextActivities', './utils/dateTimeConverter', './statementQueue'],
    function (actorModel, statementModel, activityModel, eventManager, errorsHandler, xApiSettings, constants, resultModel, scoreModel, contextModel, contextActivitiesModel, dateTimeConverter, statementQueue) {

        "use strict";

        var subscriptions = [],
            activityProvider = {
                actor: null,
                activityName: null,
                activityUrl: null,

                init: init,
                createActor: createActor,
                rootCourseUrl: null,
                turnOffSubscriptions: turnOffSubscriptions
            };

        return activityProvider;

        function init(actorData, activityName, activityUrl) {
            return Q.fcall(function () {
                if (_.isUndefined(xApiSettings.scoresDistribution.positiveVerb)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }

                activityProvider.actor = actorData;
                activityProvider.activityName = activityName;
                activityProvider.activityUrl = activityUrl;
                activityProvider.rootCourseUrl = activityUrl != undefined ? activityUrl.split("?")[0].split("#")[0] : '';

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

        function pushStatementIfSupported(statement) {
            if (_.contains(xApiSettings.xApi.allowedVerbs, statement.verb.display[xApiSettings.defaultLanguage])) {
                statementQueue.enqueue(statement);
            }
        }

        function enqueueCourseStarted() {
            pushStatementIfSupported(createStatement(constants.verbs.started));
        }

        function enqueueCourseFinished(finishedEventData) {
            if (_.isUndefined(finishedEventData) || _.isUndefined(finishedEventData.result)) {
                throw errorsHandler.errors.notEnoughDataInSettings;
            }

            enqueueObjectivesFinishedStatement(finishedEventData);

            var result = new resultModel({
                score: new scoreModel(finishedEventData.result)
            });

            var resultVerb = finishedEventData.isCompleted ? xApiSettings.scoresDistribution.positiveVerb : constants.verbs.failed;
            pushStatementIfSupported(createStatement(resultVerb, result));
            pushStatementIfSupported(createStatement(constants.verbs.stopped));

            var dfd = Q.defer();

            statementQueue.statements.subscribe(function (newValue) {
                if (newValue.length == 0) {
                    dfd.resolve();
                }
            });

            // (^\ x_x /^)
            statementQueue.enqueue(undefined);

            return dfd.promise;
        }

        function enqueueObjectivesFinishedStatement(finishedEventData) {
            if (!_.isUndefined(finishedEventData.objectives) && _.isArray(finishedEventData.objectives) && finishedEventData.objectives.length > 0) {
                _.each(finishedEventData.objectives, function (objective) {
                    var objectiveUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
                    var statement = createStatement(constants.verbs.mastered, new resultModel({ score: new scoreModel(objective.score / 100) }), createActivity(objectiveUrl, objective.title));
                    pushStatementIfSupported(statement);
                });
            }
        }

        function learningContentExperienced(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var result = new resultModel({
                duration: dateTimeConverter.timeToISODurationString(eventData.spentTime)
            });

            var learningContentUrl = activityProvider.rootCourseUrl + '#objective/' + objective.id + '/question/' + question.id + '?learningContents';
            var parentUrl = activityProvider.rootCourseUrl + '#objective/' + objective.id + '/question/' + question.id;
            var groupingUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
            var object = createActivity(learningContentUrl, question.title);

            var context = new contextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, question.title)],
                    grouping: [createActivity(groupingUrl, objective.title)]
                })
            });

            pushStatementIfSupported(createStatement(constants.verbs.experienced, result, object, context));
        }

        function enqueueAnsweredQuestionsStatements(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = new resultModel({
                score: new scoreModel(question.score / 100),
                response: question.selectedAnswersIds.toString()
            });

            var object = new activityModel({
                id: questionUrl,
                definition: {
                    name: {
                        "en-US": question.title
                    },
                    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                    interactionType: "choice",
                    correctResponsesPattern: [question.correctAnswersIds.join("[,]")],
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

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;

            var context = new contextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, objective.title)]
                })
            });

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
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