define(['./requestManager', './errorsHandler', './verbs', './settings', 'durandal/app', '../events'],
    function (requestManager, errorsHandler, verbs, settings, app, events) {

        "use strict";

        var
            isInitialized = false,

            actorData = {},
            activityData = {},

            eventsList = [],

            init = function (actorName, actorMail, activityName, activityUrl, activityLanguage) {

                var hashIndex = activityUrl.indexOf("#/");
                if (hashIndex !== -1)
                    activityUrl = activityUrl.substring(0, hashIndex);

                if (!actorMail) {
                    errorsHandler.handleError(errorsHandler.errors.actorDataIsIncorrect);
                    return;
                }

                if (actorMail.substring(0, 7) != "mailto:")
                    actorMail = "mailto:" + actorMail;

                actorData = {
                    name: actorName,
                    mail: actorMail
                };

                if (!activityName) {
                    errorsHandler.handleError(errorsHandler.errors.activityNameIsEmpty);
                    return;
                }

                if (!activityUrl && window && window.location)
                    activityUrl = window.location.toString();

                activityData = {
                    name: activityName,
                    url: activityUrl,
                    language: activityLanguage
                };

                isInitialized = true;

                initEvents();
            },
            initEvents = function () {

                eventsList.push(
                    app.on(events.courseStarted).then(function () {
                        return trackAction(verbs.started);
                    })
                );

                eventsList.push(
                    app.on(events.courseFinished).then(function(data) {
                        Q().then(function() {
                            return trackAction(verbs.stopped);
                        }).then(function() {
                            if (_.isUndefined(data) || _.isNull(data))
                                throw 'Result data is incorrect';

                            if (_.isUndefined(settings) || _.isUndefined(settings.scoresDistribution.minScoreForPositiveResult) || _.isUndefined(settings.scoresDistribution.positiveVerb)) {
                                throw errorsHandler.errors.notEnoughDataInSettings;
                            }

                            var deferredList = Q();

                            if (_.isUndefined(data.objectivesResults) || !_.isArray(data.objectivesResults))
                                throw 'objectivesResults is incorrect';

                            _.each(data.objectivesResults, function(result) {
                                deferredList = deferredList.then(function() {
                                    return trackAction(verbs.mastered, result.score / 100, {
                                        name: result.title
                                    });
                                });
                            });

                            if (_.isUndefined(data.totalScore))
                                throw 'totalScore is undefined';

                            deferredList = deferredList.then(function () {
                                return trackAction(data.totalScore >= settings.scoresDistribution.minScoreForPositiveResult
                                    ? settings.scoresDistribution.positiveVerb
                                    : verbs.failed,
                                    data.totalScore);
                            });

                            return deferredList;
                        }).then(function() {
                            if (!!data.callback)
                                data.callback();
                        }).fail(function(error) {
                            errorsHandler.handleError(error);
                        });
                    })
                );
            },
            destroy = function () {
                _.each(eventsList, function (event) {
                    event.off();
                });
            },
            trackAction = function (verb, result, object) {
                if (isInitialized)
                    return requestManager.trackAction(actorData, verb, object || activityData, result);
            };

        return {
            init: init,
            trackAction: trackAction,
            destroy: destroy
        };

    }
);