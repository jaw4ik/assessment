define(['durandal/app','guard', 'userContext', 'repositories/commentRepository', 'eventTracker', 'constants',
    'plugins/router', 'notify', 'localization/localizationManager'],
    function (app, guard, userContext, commentRepository, eventTracker, constants, router, notify, localizationManager) {

        var viewModel = {
            courseId: null,
            isCommentsLoading: ko.observable(),
            comments: ko.observableArray(),
            hasAccessToComments: ko.observable(userContext.hasStarterAccess()),
            activate: activate,
            openUpgradePlanUrl: openUpgradePlanUrl,
            removeComment: removeComment,
            restoreComment: restoreComment,
            deletedByCollaborator: deletedByCollaborator
        };

        app.on(constants.messages.course.comment.deletedByCollaborator, viewModel.deletedByCollaborator);

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
                            viewModel.comments(_.map(comments, function(item) {
                                return {
                                    id: ko.observable(item.id),
                                    text: item.text,
                                    email: item.email,
                                    name: item.name,
                                    createdOn: item.createdOn,
                                    isDeleted: ko.observable(false)
                                };
                            }));
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
            return commentRepository.removeComment(viewModel.courseId, comment.id()).then(function (success) {
                if (success) {
                    comment.isDeleted(true);
                    notify.saved();
                } else {
                    throw "Comment is not deleted";
                }
            }).fail(function() {
                notify.error(localizationManager.localize('commentWasNotDeletedError'));
            });
        }

        function restoreComment(comment) {
            return commentRepository.restoreComment(viewModel.courseId, comment).then(function (restoredId) {
                if (!_.isNullOrUndefined(restoredId)) {
                    comment.isDeleted(false);
                    comment.id(restoredId);
                    notify.saved();
                } else {
                    throw "Comment is not restored";
                }
            }).fail(function() {
                notify.error(localizationManager.localize('commentWasNotRestoredError'));
            });
        }

        function deletedByCollaborator(courseId, commentId) {
            if (viewModel.courseId !== courseId) {
                return;
            }

            viewModel.comments(_.reject(viewModel.comments(), function (item) {
                return item.id() === commentId;
            }));
        }
    }
);