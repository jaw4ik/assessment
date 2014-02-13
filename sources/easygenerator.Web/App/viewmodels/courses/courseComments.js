define(['guard', 'userContext', 'repositories/commentRepository'],
    function (guard, userContext, commentRepository) {

        var viewModel = {
            isCommentsLoading: ko.observable(),
            comments: ko.observableArray(),
            courseId: '',
            hasAccessToComments: ko.observable(userContext.hasStarterAccess()),
            activate: activate
        };

        return viewModel;

        function activate(courseId) {
            guard.throwIfNotString(courseId, 'Course id is not a string');

            viewModel.courseId = courseId;
            viewModel.isCommentsLoading(true);

            return Q.fcall(function () {
                userContext.identify().then(function () {
                    viewModel.hasAccessToComments(userContext.hasStarterAccess());

                    if (userContext.hasStarterAccess()) {
                        return commentRepository.getCollection(viewModel.courseId).then(function (comments) {
                            viewModel.comments(comments);
                        });
                    }
                }).fin(function() {
                    viewModel.isCommentsLoading(false);
                });
            });
        }
    }
);