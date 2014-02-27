define(['guard', 'eventTracker', 'plugins/router', 'routing/routingContext'],
    function (guard, eventTracker, router, routingContext) {

        var
           events = {
               navigateToDesignCourse: 'Navigate to design course'
           };

        var viewModel = function () {

            return {
                navigate: function () {
                    eventTracker.publish(events.navigateToDesignCourse);
                    router.navigate('design/' + routingContext.courseId());
                },
                navigationLink: ko.computed(function () { return '#design/' + routingContext.courseId(); }),
                title: 'courseDesign',
                isActive: ko.computed(function() {
                    return routingContext.moduleName() == "design";
                }),
                isRootView: ko.computed(function () {
                    return routingContext.moduleName() == "design";
                })
            };
        };

        return viewModel;

    });
