define(['viewmodels/courses/courseNavigation/items/create', 'viewmodels/courses/courseNavigation/items/design', 'viewmodels/courses/courseNavigation/items/publish', 'eventTracker', 'plugins/router'],
    function (CreateNavigationItem, DesignNavigationItem, PublishNavigationItem, eventTracker, router) {
        "use strict";

        var events = {
            previewCourse: 'Preview course'
        };

        var navigationItems = [];
        var activate = function () {
            this.navigationItems = [
                new CreateNavigationItem(),
                new DesignNavigationItem(),
                new PublishNavigationItem()
            ];
        };

        var previewCourse = function () {
            eventTracker.publish(events.previewCourse);
            router.openUrl('/preview/' + router.routeData().courseId);
        };

        return {
            activate: activate,
            previewCourse: previewCourse,
            navigationItems: navigationItems
        };

    });
