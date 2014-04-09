define(['guard', 'userContext', 'repositories/commentRepository'],
    function (guard, userContext, commentRepository) {

        var viewModel = {
            isCommentsLoading: ko.observable(),
            comments: ko.observableArray(),
            hasAccessToComments: ko.observable(userContext.hasStarterAccess()),
            activate: activate
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
    }
);