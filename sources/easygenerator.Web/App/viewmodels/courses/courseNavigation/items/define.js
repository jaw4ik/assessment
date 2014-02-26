﻿ define(['guard', 'eventTracker', 'plugins/router', 'routing/routingContext'],
    function (guard, eventTracker, router, routingContext) {

        var
           events = {
               navigateToDefineCourse: 'Navigate to define course'
           };

        var viewModel = function () {

            return {
                navigate: function () {
                    eventTracker.publish(events.navigateToDefineCourse);
                    router.navigate('course/' + routingContext.courseId());
                },
                navigationLink: '#course/' + routingContext.courseId(),
                title: 'courseDefine',
                isActive: ko.computed(function () {
                    return routingContext.moduleName() != "design" && routingContext.moduleName() != "deliver";
                }),
                isRootView: ko.computed(function () {
                    return routingContext.moduleName() == "course";
                })
            };
        };

        return viewModel;

    });
