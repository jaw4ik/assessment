define(['xApi/models/actor', 'xApi/models/statement', 'xApi/models/activity', 'xApi/settings', 'eventManager', 'xApi/requestManager', 'xApi/constants', 'xApi/errorsHandler'],
    function (actorModel, statementModel, activityModel, xApiSettings, eventManager, requestManager, constants, errorsHandler) {
        "use strict";

        var
            activityProvider = {
                actor: null,
                activityName: null,
                activityUrl: null,
                init: init,
                createActor: createActor
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

                eventManager.subscribeForEvent(eventManager.events.courseStarted).then(function () {
                    sendCourseStarted();
                });

                eventManager.subscribeForEvent(eventManager.events.courseFinished).then(function (finishedEventData) {
                    sendCourseFinished(finishedEventData);
                });
            });

        }

        function sendCourseStarted() {
            var statement = createStatement(constants.verbs.started);
            requestManager.sendStatement(statement);
        }

        function sendCourseFinished(finishedEventData) {
            return requestManager.sendStatement(createStatement(constants.verbs.stopped)).then(function () {
                if (!_.isUndefined(finishedEventData.objectives) && _.isArray(finishedEventData.objectives) && finishedEventData.objectives.length > 0) {
                    return sendMasteredStatementsForObjectives(finishedEventData.objectives);
                }
            }).then(function () {
                if (_.isUndefined(finishedEventData) || _.isUndefined(finishedEventData.result)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }

                var result = {
                    score: finishedEventData.result
                };

                if (result.score >= xApiSettings.scoresDistribution.minScoreForPositiveResult) {
                    return requestManager.sendStatement(createStatement(xApiSettings.scoresDistribution.positiveVerb, result));
                } else {
                    return requestManager.sendStatement(createStatement(constants.verbs.failed, result));
                }
            }).then(function () {
                if (!!finishedEventData.callback) {
                    finishedEventData.callback.call(this);
                }
            }).fail(function (error) {
                errorsHandler.handleError(error);
            });
        }

        function sendMasteredStatementsForObjectives(objectives) {
            var promises = [];

            _.each(objectives, function (objective) {
                var statement = createStatement(constants.verbs.mastered, { score: objective.score / 100 }, createActivity(objective.title));
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

        function createActivity(name) {
            return activityModel({
                id: activityProvider.activityUrl,
                definition: {
                    name: {
                        "en-US": name
                    }
                }
            });
        }

        function createStatement(verb, result, activity) {
            var activityData = activity || createActivity(activityProvider.activityName);

            return statementModel({
                actor: activityProvider.actor,
                verb: verb,
                object: activityData,
                result: result
            });
        }
    }
);