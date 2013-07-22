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
            },
            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var objectiveId = '',
            title = ko.observable(),
            image = ko.observable(),
            questions = ko.observableArray([]),
            currentSortingOption = ko.observable(),
            
            sortByTitleAsc = function() {
                sendEvent(events.sortByTitleAsc);
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                questions(_.sortBy(questions(), function (question) { return question.title.toLowerCase(); }));
            },
            
            sortByTitleDesc = function () {
                sendEvent(events.sortByTitleDesc);
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                questions(_.sortBy(questions(), function (question) { return question.title.toLowerCase(); }).reverse());
            },
            
            navigateToObjectives = function () {
                sendEvent(events.navigateToObjectives);
                router.navigateTo('#/objectives');
            },
            
            navigateToCreation = function () {
                sendEvent(events.navigateToCreation);
                router.navigateTo('#/objective/' + objectiveId + '/question/create');
            },
            
            navigateToDetails = function (item) {
                sendEvent(events.navigateToDetails);
                router.navigateTo('#/objective/' + objectiveId + '/question/' + item.id);
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
                                    return {
                                        id: item.id,
                                        title: item.title,
                                        isSelected: ko.observable(false),
                                        toggleSelection: function () {
                                            sendEvent(events.selectQuestion);
                                            this.isSelected(!this.isSelected());
                                        }
                                    };
                                })
                                .sortBy(function (question) { return question.title.toLowerCase(); })
                                .value();
                questions(array);
            };
        
        return {
            objectiveId: objectiveId,

            title: title,
            image: image,
            questions: questions,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToObjectives: navigateToObjectives,

            activate: activate
        };
    }
);