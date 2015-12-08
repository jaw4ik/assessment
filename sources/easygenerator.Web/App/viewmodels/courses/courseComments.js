define(['guard', 'userContext', 'repositories/commentRepository', 'eventTracker', 'constants',
    'plugins/router', 'notify', 'localization/localizationManager'],
    function (guard, userContext, commentRepository, eventTracker, constants, router, notify, localizationManager) {

        var viewModel = {
            courseId: null,
            isCommentsLoading: ko.observable(),
            comments: ko.observableArray(),
            hasAccessToComments: ko.observable(userContext.hasStarterAccess()),
            activate: activate,
            openUpgradePlanUrl: openUpgradePlanUrl,
            removeComment: removeComment
        };

        return viewModel;

        function activate(courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');

                viewModel.courseId = courseId;
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

        function removeComment(comment) {
            return commentRepository.removeComment(viewModel.courseId, comment.id).then(function (success) {
                if (success) {
                    viewModel.comments.remove(comment);
                    notify.saved();
                } else {
                    throw "Comment is not deleted";
                }
            }).fail(function() {
                notify.error(localizationManager.localize('commentWasNotDeletedError'));
            });
        }
    }
);