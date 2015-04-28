define(['guard', 'userContext', 'repositories/commentRepository', 'eventTracker', 'constants', 'plugins/router'],
    function (guard, userContext, commentRepository, eventTracker, constants, router) {

        var viewModel = {
            isCommentsLoading: ko.observable(),
            comments: ko.observableArray(),
            hasAccessToComments: ko.observable(userContext.hasStarterAccess()),
            activate: activate,
            openUpgradePlanUrl: openUpgradePlanUrl
        };

        return viewModel;

        function activate(courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');

                viewModel.isCommentsLoading(true);

                return userContext.identify().then(function () {
                    viewModel.hasAccessToComments(userContext.hasStarterAccess());

                    if (userContext.hasStarterAccess()) {
                        return commentRepository.getCollection(courseId).then(function (comments) {
                            viewModel.comments(comments);
                        });
                    }
                }).fin(function () {
                    viewModel.isCommentsLoading(false);
                });
            });
        }

        function openUpgradePlanUrl() {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.externalReview);
            router.openUrl(constants.upgradeUrl);
        }
    }
);