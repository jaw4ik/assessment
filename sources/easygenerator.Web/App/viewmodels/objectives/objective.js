define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router'],
    function (dataContext, constants, eventTracker, router) {
        "use strict";

        var
            events = {
                category: 'Learning Objective',
                navigateToCreation: "Navigate to question creation",
                navigateToDetails: "Navigate to question details",
                navigateToObjectives: "Navigate to Learning Objectives",
                sortByTitleAsc: "Sort questions by title ascending",
                sortByTitleDesc: "Sort questions by title descending",
                selectQuestion: "Select question",
                addQuestion: "Add question",
                editQuestionTitle: "Edit question title",
                deleteQuestions: "Delete question"
            },
            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var objectiveId = '',
            title = ko.observable(),
            image = ko.observable(),
            questions = ko.observableArray([]),
            currentSortingOption = ko.observable(),

            sortByTitleAsc = function () {
                sendEvent(events.sortByTitleAsc);
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                questions(_.sortBy(questions(), function (question) { return question.title().toLowerCase(); }));
            },

            sortByTitleDesc = function () {
                sendEvent(events.sortByTitleDesc);
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                questions(_.sortBy(questions(), function (question) { return question.title().toLowerCase(); }).reverse());
            },

            navigateToObjectives = function () {
                sendEvent(events.navigateToObjectives);
                router.navigateTo('#/objectives');
            },

            navigateToDetails = function (item) {
                sendEvent(events.navigateToDetails);
                router.navigateTo('#/objective/' + objectiveId + '/question/' + item.id);
            },

            addQuestion = function () {
                var model = {
                    id: generateNewEntryId(questions()),
                    title: ''
                };

                var question = mapQuestion(model);
                question.isEditing(true);
                questions.push(question);
                sendEvent(events.addQuestion);
            },

            deleteQuestions = function () {
                _.each(getSelectedQuestions(), deleteQuestion);
                sendEvent(events.deleteQuestions);
            },

            deleteQuestion = function (question) {
                var objective = _.find(dataContext.objectives, function (e) {
                    return e.id == objectiveId;
                });

                objective.questions = _.reject(objective.questions, function (item) {
                    return item.id == question.id;
                });

                questions.remove(question);
            },

            mapQuestion = function (item) {
                var result = {
                    id: item.id,
                    title: ko.observable(item.title).extend({
                        required: { message: 'Please, provide title for question' },
                        maxLength: { message: 'Question title can not be longer than 255 symbols', params: 255 }
                    }),
                    isSelected: ko.observable(false),
                    isEditing: ko.observable(false),
                    toggleSelection: function (instance) {
                        sendEvent(events.selectQuestion);
                        instance.isSelected(!instance.isSelected());
                    },
                    saveTitle: function (instance) {
                        if (!instance.title.isValid()) {
                            instance.title.isModified(true);
                            return;
                        }

                        var objective = _.find(dataContext.objectives, function (e) {
                            return e.id == objectiveId;
                        });

                        var question = _.find(objective.questions, function (e) {
                            return e.id == instance.id;
                        });

                        if (_.isObject(question)) {
                            question.title = instance.title();
                        } else {
                            objective.questions.push({
                                id: instance.id,
                                title: instance.title()
                            });
                        }

                        instance.isEditing(false);
                        sendEvent(events.editQuestionTitle);
                    }
                };

                return result;
            },

            activate = function (routeData) {
                if (_.isEmpty(routeData) || _.isEmpty(routeData.id)) {
                    router.replaceLocation('#/400');
                    return;
                }

                var objective = _.find(dataContext.objectives, function (item) {
                    return item.id == routeData.id;
                });

                if (!_.isObject(objective)) {
                    router.replaceLocation('#/404');
                    return;
                }

                objectiveId = routeData.id;
                title(objective.title);
                image(objective.image);

                currentSortingOption(constants.sortingOptions.byTitleAsc);
                var array = _.chain(objective.questions)
                                .map(function (item) {
                                    return mapQuestion(item);
                                })
                    .sortBy(function (question) { return question.title().toLowerCase(); })
                                .value();
                questions(array);
            },

            getSelectedQuestions = function () {
                return _.reject(questions(), function (item) {
                    return !item.isSelected();
                });
            },

            canDeleteQuestions = ko.computed(function () {
                return getSelectedQuestions().length == 1;
            }),

            generateNewEntryId = function (collection) {
                var id = 0;
                if (collection.length > 0) {
                    var maxId = _.max(_.map(collection, function (exp) {
                        return parseInt(exp.id);
                    }));

                    id = maxId + 1;
                }

                return id;
            };

        return {
            objectiveId: objectiveId,

            title: title,
            image: image,
            questions: questions,
            canDeleteQuestions: canDeleteQuestions,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,

            navigateToDetails: navigateToDetails,
            navigateToObjectives: navigateToObjectives,

            addQuestion: addQuestion,
            deleteQuestions: deleteQuestions,

            activate: activate
        };
    }
);