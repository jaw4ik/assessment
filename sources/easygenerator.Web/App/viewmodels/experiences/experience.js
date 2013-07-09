define(['dataContext', 'durandal/plugins/router', 'constants', 'eventTracker'],
    function (dataContext, router, constants, eventTracker) {
        "use strict";

        var
            events = {
                category: 'Experience',
                navigateToExperiences: 'Navigate to experiences'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var
            title = '',
            objectives = [],

            navigateBack = function () {
                sendEvent(events.navigateToExperiences);
                router.navigateTo('#/experiences');
            },

            activate = function (routeData) {
                var experience = _.find(dataContext.experiences, function (item) {
                    return item.id == routeData.id;
                });

                if (!_.isObject(experience)) {
                    router.navigateTo('404');
                    return;
                }

                this.title = experience.title;
                this.objectives = experience.objectives;
            };

        return {
            activate: activate,
            title: title,
            objectives: objectives,
            navigateBack: navigateBack
        };
    }
);