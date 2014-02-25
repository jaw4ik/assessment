define(['constants', 'durandal/app', 'viewmodels/panels/tabs/reviewTab', 'viewmodels/panels/tabs/feedbackTab', 'repositories/courseRepository',
        'plugins/router', 'notify', 'localization/localizationManager', 'routing/routingContext'],
    function (constants, app, reviewTab, feedbackTab, repository, router, notify, localizationManager, routingContext) {
        var viewModel = {
            activeTab: ko.observable(),
            reviewTab: reviewTab,
            feedbackTab: feedbackTab,
            activate: activate,
            toggleTabVisibility: toggleTabVisibility,
            onCollapsed: onCollapsed,
            isExpanded: ko.observable(false),
            reviewTabActivationData: ko.observable({}),
            lastReviewTabActivationData: ko.observable(null)
        };

        viewModel.isReviewTabVisible = ko.computed(function () {
            return routingContext.courseId() != null;
        });
       
        viewModel.reviewTabActivationData = ko.computed(function () {
            var courseId = routingContext.courseId();
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
                    }).fail(function () {
                        notify.error(localizationManager.localize('loadingCourseError'));
                    });
                }

                return viewModel.lastReviewTabActivationData();
            });
        });

        app.on(constants.messages.course.publishForReview.completed, function (course) {
            if (course.id !== routingContext.courseId())
                return;

            if (viewModel.lastReviewTabActivationData() != null) {
                viewModel.lastReviewTabActivationData({
                    courseId: course.id,
                    reviewUrl: course.reviewUrl
                });
            }
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