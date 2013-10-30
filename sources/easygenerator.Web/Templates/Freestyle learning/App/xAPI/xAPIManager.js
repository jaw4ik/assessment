define(['./requestManager', './statementBuilder', './errorsHandler', './verbs', './settings', 'durandal/app', '../events', '../context'],
    function (requestManager, statementBuilder, errorsHandler, verbs, settings, app, events, dataContext) {

        "use strict";

        var
            isInitialized = false,

            actorData = {},
            courseData = {},

            eventsList = [],

            init = function (username, usermail, courseName, courseUrl) {

                if (_.isNullOrUndefined(usermail)) {
                    errorsHandler.handleError(errorsHandler.errors.actorDataIsIncorrect);
                    return;
                }

                if (_.isNullOrUndefined(courseName)) {
                    errorsHandler.handleError(errorsHandler.errors.activityNameIsEmpty);
                    return;
                }

                var hashIndex = courseUrl.indexOf("#");
                if (hashIndex !== -1)
                    courseUrl = courseUrl.substring(0, hashIndex);

                actorData = {
                    name: username,
                    mbox: usermail
                };

                courseData = {
                    name: courseName,
                    id: courseUrl
                };

                isInitialized = true;

                initEvents();
            },

            trackAction = function (verb, result, object, context) {
                if (isInitialized) {
                    var statement = statementBuilder.build(actorData, verb, object || courseData, result, context);
                    return requestManager.sendRequest(statement);
                }
            },

            initEvents = function () {

                eventsList.push(
                    app.on(events.courseStarted).then(function () {
                        return trackAction(verbs.started);
                    })
                );

                eventsList.push(
                    app.on(events.courseFinished).then(function (data) {
                        Q().then(function () {
                            return trackAction(verbs.stopped);
                        }).then(function () {
                            if (_.isNullOrUndefined(data))
                                throw 'Result data is incorrect';

                            if (_.isNullOrUndefined(settings) ||
                                _.isNullOrUndefined(settings.scoresDistribution) ||
                                _.isNullOrUndefined(settings.scoresDistribution.minScoreForPositiveResult) ||
                                _.isNullOrUndefined(settings.scoresDistribution.positiveVerb)) {
                                throw errorsHandler.errors.notEnoughDataInSettings;
                            }

                            if (_.isNullOrUndefined(data.objectivesResults) || !_.isArray(data.objectivesResults))
                                throw 'objectivesResults is incorrect';

                            if (_.isNullOrUndefined(data.totalScore))
                                throw 'totalScore is undefined';

                            var deferredList = Q();

                            _.each(data.objectivesResults, function (result) {
                                deferredList = deferredList.then(function () {
                                    return trackAction(
                                        verbs.mastered,
                                        result.score / 100,
                                        {
                                            name: result.title
                                        }
                                    );
                                });
                            });

                            deferredList = deferredList.then(function () {
                                return trackAction(
                                    data.totalScore >= settings.scoresDistribution.minScoreForPositiveResult
                                        ? settings.scoresDistribution.positiveVerb
                                        : verbs.failed,
                                    data.totalScore
                                );
                            });

                            return deferredList;
                        }).then(function () {
                            if (!_.isNullOrUndefined(data.callback))
                                data.callback();
                        }).fail(function (error) {
                            errorsHandler.handleError(error);
                        });
                    })
                );

                eventsList.push(
                    app.on(events.learningContentExperienced).then(function (data) {
                        if (_.isNullOrUndefined(data) ||
                            _.isNullOrUndefined(data.objectiveId) ||
                            _.isNullOrUndefined(data.questionId) ||
                            _.isNullOrUndefined(data.spentTime)) {
                            errorsHandler.handleError('Results data is incorrect. Event: learningContentExperienced');
                            return;
                        }

                        var objective = _.find(dataContext.objectives, function (item) {
                            return item.id == data.objectiveId;
                        });

                        if (!objective) {
                            errorsHandler.handleError('Objective not found. Event: learningContentExperienced');
                            return;
                        }

                        var question = _.find(objective.questions, function (item) {
                            return item.id == data.questionId;
                        });

                        if (!question) {
                            errorsHandler.handleError('Question not found. Event: learningContentExperienced');
                            return;
                        }

                        var questionUrl = courseData.id + '#/objective/' + data.objectiveId + '/question/' + data.questionId;

                        var result = {
                            duration: _timeToISODurationString(data.spentTime)
                        };

                        var object = {
                            id: questionUrl + '/learningContents',
                            name: question.title
                        };

                        var context = {
                            contextActivities: {
                                parent: [
                                    {
                                        id: questionUrl,
                                        objectType: "Activity"
                                    }
                                ]
                            }
                        };

                        return trackAction(verbs.experienced, result, object, context);
                    })
                );

                eventsList.push(
                    app.on(events.questionAnswered).then(function (data) {
                        if (_.isNullOrUndefined(data) ||
                            _.isNullOrUndefined(data.objective) ||
                            _.isNullOrUndefined(data.question)) {
                            errorsHandler.handleError('Results data is incorrect. Event: questionAnswered');
                            return;
                        }

                        var questionUrl = courseData.id + '#/objective/' + data.objective.id + '/question/' + data.question.id;

                        var object = {
                            id: questionUrl,
                            name: data.question.title
                        };

                        var context = {
                            contextActivities: {
                                parent: [
                                    {
                                        id: courseData.id,
                                        objectType: "Activity"
                                    }
                                ]
                            }
                        };

                        return trackAction(verbs.answered, data.question.score / 100, object, context);
                    })
                );

            },

            destroy = function () {
                _.each(eventsList, function (event) {
                    event.off();
                });
            },

            _timeToISODurationString = function (timeInMilliseconds) {

                timeInMilliseconds /= 1000;

                var hours = parseInt(timeInMilliseconds / 3600, 10);
                timeInMilliseconds -= hours * 3600;

                var minutes = parseInt(timeInMilliseconds / 60, 10);
                timeInMilliseconds -= minutes * 60;

                var seconds = parseInt(timeInMilliseconds, 10);

                return 'PT' + hours + 'H' + minutes + 'M' + seconds + 'S';
            }
        ;

        return {
            init: init,
            trackAction: trackAction,
            destroy: destroy
        };

    }
);