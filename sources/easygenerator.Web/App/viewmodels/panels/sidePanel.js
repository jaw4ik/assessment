define(['constants', 'durandal/app', 'viewmodels/panels/tabs/reviewTab', 'viewmodels/panels/tabs/feedbackTab', 'repositories/courseRepository',
        'plugins/router'],
    function (constants, app, reviewTab, feedbackTab, repository, router) {
        var viewModel = {
            activeTab: ko.observable(),
            reviewTab: reviewTab,
            feedbackTab: feedbackTab,
            activate: activate,
            toggleTabVisibility: toggleTabVisibility,
            onCollapsed: onCollapsed,
            isExpanded: ko.observable(false),
            reviewTabActivationData: ko.observable({}),
            lastReviewTabActivationData: ko.observable(null),
            lastAction: ko.observable(false)
        };

        viewModel.isReviewTabVisible = ko.computed(function () {
            return router.routeData().courseId != null;
        });

        viewModel.reviewTabActivationData = ko.computed(function () {
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
                            reviewUrl: course.reviewUrl
                        };
                        viewModel.lastReviewTabActivationData(data);

                        return data;
                    });
                }

                return viewModel.lastReviewTabActivationData();
            });
        });

        app.on(constants.messages.course.publishForReview.completed, function (course) {
            if (course.id !== router.routeData().courseId)
                return;

            if (viewModel.lastReviewTabActivationData() != null) {
                viewModel.lastReviewTabActivationData({
                    courseId: course.id,
                    reviewUrl: course.reviewUrl
                });
            }
        });

        app.on(constants.messages.helpHint.shown, function () {
            viewModel.lastAction(constants.messages.helpHint.shown);
        });
        app.on(constants.messages.helpHint.hidden, function () {
            viewModel.lastAction(constants.messages.helpHint.hidden);
        });

        router.on('router:route:activating').then(function() {
            viewModel.lastAction('router:route:activating');
        });

        router.on('router:navigation:composition-complete').then(function () {
            viewModel.lastAction('router:navigation:composition-complete');
        });

        return viewModel;
        
        function activate() {
            return Q.fcall(function () {
                viewModel.activeTab(null);
            });
        }

        function toggleTabVisibility(tab) {
            var isTabActive = viewModel.activeTab() == tab;
            if (!isTabActive) {
                viewModel.activeTab(tab);
                viewModel.isExpanded(true);
            } else {
                viewModel.isExpanded(false);
            }
        }

        function onCollapsed() {
            viewModel.activeTab(null);
        }
    }
);