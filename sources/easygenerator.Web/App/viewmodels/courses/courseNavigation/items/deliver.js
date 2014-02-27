define(['guard', 'eventTracker', 'plugins/router', 'routing/routingContext'],
    function (guard, eventTracker, router, routingContext) {

        var
           events = {
               navigateToDeliverCourse: 'Navigate to deliver course'
           };

        var viewModel = function () {

            return {
                navigate: function () {
                    eventTracker.publish(events.navigateToDeliverCourse);
                    router.navigate('deliver/' + routingContext.courseId());
                },
                navigationLink: ko.computed(function () { return '#deliver/' + routingContext.courseId(); }),
                title: 'courseDeliver',
                isActive: ko.computed(function () {
                    return routingContext.moduleName() == "deliver";
                }),
                isRootView: ko.computed(function () {
                    return routingContext.moduleName() == "deliver";
                })
            };
        };

        return viewModel;

    });
