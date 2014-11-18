define(['viewmodels/courses/courseNavigation/items/create',
        'viewmodels/courses/courseNavigation/items/design',
        'viewmodels/courses/courseNavigation/items/publish',
        'viewmodels/courses/courseNavigation/items/results',
        'eventTracker', 'plugins/router', 'dialogs/publishCourse/publishCourse'],
    function (CreateNavigationItem, DesignNavigationItem, PublishNavigationItem, ResultsNavigationItem, eventTracker, router, vmPublishCourse) {
        "use strict";

        var events = {
            previewCourse: 'Preview course'
        };

        var viewModel = {
            activate: activate,
            publishCourse: publishCourse,
            previewCourse: previewCourse,
            navigationItems: []
        };

        viewModel.coursePreviewLink = ko.computed(function () {
            return '/preview/' + router.routeData().courseId;
        });

        return viewModel;

        function activate() {
            viewModel.navigationItems = [
                new CreateNavigationItem(),
                new DesignNavigationItem(),
                new PublishNavigationItem(),
                new ResultsNavigationItem()
            ];
        };

        function previewCourse() {
            eventTracker.publish(events.previewCourse);
            router.openUrl(viewModel.coursePreviewLink());
        };

        function publishCourse() {
            vmPublishCourse.show();
        };

    });
