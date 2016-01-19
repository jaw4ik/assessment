var app = app || {};

app.reviewViewModel = function (dataStorage) {
    var patternEmail = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,15})+)$/,
           userNameKey = 'usernameForReview',
           userMailKey = 'usermailForReview',
           storage = dataStorage || localStorage;


    var viewModel = {
        text: ko.observable(''),
        name: ko.observable(''),
        email: ko.observable(''),
        showTextValidationError: ko.observable(false),
        showIdentifyUserForm: ko.observable(false),
        isExpanded: ko.observable(false),
        isSaved: ko.observable(false),
        isFailed: ko.observable(false),
        isReviewPanelVisible: ko.observable(true),

        toggleVisiblity: function () {
            viewModel.isExpanded(!viewModel.isExpanded());
        },
        onTextFocused: function () {
            viewModel.showTextValidationError(false);
        },
        onCollapsed: function () {
            viewModel.isSaved(false);
            viewModel.isFailed(false);
        },
        addComment: function(courseId) {
            if (_.isNullOrUndefined(courseId)) {
                throw 'Course id is not specified';
            }

            if (!viewModel.showIdentifyUserForm()) {
                if (!viewModel.text() || _.isEmptyOrWhitespace(viewModel.text())) {
                    viewModel.showTextValidationError(true);
                    return;
                }
            } else {
                viewModel.name.isModified(true);
                viewModel.email.isModified(true);

                if (!viewModel.name.isValid() || !viewModel.email.isValid()) {
                    return;
                }

                storage.setItem(userNameKey, viewModel.name());
                storage.setItem(userMailKey, viewModel.email());
            }

            var username = storage.getItem(userNameKey),
                usermail = storage.getItem(userMailKey);

            if (!username || !username.trim() || !usermail || !usermail.trim()) {
                viewModel.showIdentifyUserForm(true);
                return;
            }

            return postUserComment(username, usermail, viewModel.text(), courseId);
        }
    };

    viewModel.name.isModified = ko.observable(false);
    viewModel.name.isValid = ko.computed(function() {
        return viewModel.name() && viewModel.name().trim() && viewModel.name().trim().length <= 255;
    });

    viewModel.email.isModified = ko.observable(false);
    viewModel.email.isValid = ko.computed(function() {
        return viewModel.email() && patternEmail.test(viewModel.email().trim()) && viewModel.email().trim().length <= 254;
    });

    function postUserComment(username, usermail, comment, courseId) {
        viewModel.isSaved(false);
        viewModel.isFailed(false);

        return $.ajax({
            url: '/api/comment/create',
            data: { courseId: courseId, text: comment.trim(), createdByName: username.trim(), createdBy: usermail.trim() },
            type: 'POST'
        }).done(function (response) {
            if (response) {
                if (response.success) {
                    viewModel.showIdentifyUserForm(false);
                    viewModel.isSaved(true);
                    viewModel.text('');
                } else {
                    viewModel.isFailed(true);
                }
            } else {
                throw 'Response is not an object';
            }
        }).fail(function () {
            viewModel.isFailed(true);
        });
    };

    window.addEventListener("message", onMessageReceived, false);

    function onMessageReceived(event) {
        if (event && event.data && event.data.supportsNativeReview) {
            viewModel.isReviewPanelVisible(false);
        }
    }

    return viewModel;
};

