define(['constants', 'durandal/app', 'viewmodels/panels/tabs/reviewTab', 'repositories/courseRepository', 'plugins/router'],
    function (constants, app, reviewTab, repository, router) {
        var viewModel = {
            activeTab: ko.observable(),
            reviewTab: reviewTab,

            activate: activate,

            toggleTabVisibility: toggleTabVisibility,
            onCollapsed: onCollapsed,
            isExpanded: ko.observable(false),

            getReviewTabActivationData: getReviewTabActivationData,
            lastReviewTabActivationData: ko.observable(null),

            coursePublishForReviewCompleted: coursePublishForReviewCompleted,
            routerCompositionComplete: routerCompositionComplete
        };

        viewModel.isReviewTabVisible = ko.computed(function () {
            return router.routeData().courseId != null;
        });

        app.on(constants.messages.course.publishForReview.completed, viewModel.coursePublishForReviewCompleted);
        router.on('router:navigation:composition-complete').then(viewModel.routerCompositionComplete);

        return viewModel;

        function activate() {
            return Q.fcall(function () {
                viewModel.activeTab(null);
            });
        }

        function getReviewTabActivationData() {
            var courseId = router.routeData().courseId;
            return Q.fcall(function () {
                if (courseId == null) {
                    return null;
                }

                if (viewModel.lastReviewTabActivationData() == null ||
                    (viewModel.lastReviewTabActivationData() != null && viewModel.lastReviewTabActivationData().courseId != courseId)) {
                    return repository.getById(courseId).then(function (course) {
                        var data = {
                            courseId: course.id,
                            reviewUrl: course.publishForReview.packageUrl
                        };
                        viewModel.lastReviewTabActivationData(data);

                        return data;
                    });
                }

                return viewModel.lastReviewTabActivationData();
            });
        }

        function toggleTabVisibility(tab) {
            var isTabActive = viewModel.activeTab() == tab;
            if (!isTabActive) {
                viewModel.activeTab(tab);
                viewModel.isExpanded(true);

                app.trigger(constants.messages.sidePanel.expanded);
            } else {
                viewModel.isExpanded(false);
            }
        }

        function onCollapsed() {
            viewModel.activeTab(null);

            app.trigger(constants.messages.sidePanel.collapsed);
        }

        function coursePublishForReviewCompleted(course) {
            if (course.id !== router.routeData().courseId)
                return;

            if (viewModel.lastReviewTabActivationData() != null) {
                viewModel.lastReviewTabActivationData({
                    courseId: course.id,
                    reviewUrl: course.publishForReview.packageUrl
                });
            }
        }

        function routerCompositionComplete() {
            viewModel.isExpanded(false);
        }
    }
);