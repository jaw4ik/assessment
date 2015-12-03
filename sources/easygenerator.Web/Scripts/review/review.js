var app = app || {};

app.reviewViewModel = function () {

    var patternEmail = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/,
        userNameKey = 'username-for-review',
        userMailKey = 'usermail-for-review';

    var isExpanded = ko.observable(false),
        text = ko.observable(),
        hasValidationError = ko.observable(false),
        hasNameValidationError = ko.observable(false),
        hasEmailValidationError = ko.observable(false),
        name = ko.observable(''),
        email = ko.observable(''),
        showIdentifyUserForm = ko.observable(false),
        isSaved = ko.observable(false),
        isFailed = ko.observable(false),

        toggleVisiblity = function () {
            isExpanded(!isExpanded());
        },

        onTextFocused = function () {
            hasValidationError(false);
        },

        onCollapsed = function () {
            isSaved(false);
            isFailed(false);
        },

        addComment = function (courseId) {
            if (_.isNullOrUndefined(courseId)) {
                throw 'Course id is not specified';
            }

            if (!showIdentifyUserForm()) {

                if (!text() || _.isEmptyOrWhitespace(text())) {
                    hasValidationError(true);
                    return;
                }

                var username = localStorage.getItem(userNameKey),
                    usermail = localStorage.getItem(userMailKey);

                if (!username || !username.trim() || !usermail || !usermail.trim()) {
                    showIdentifyUserForm(true);
                    return;
                }

                postUserComment(username, usermail, text(), courseId);

            } else {
                hasNameValidationError(!name() || !name().trim());
                hasEmailValidationError(!email() || !patternEmail.test(email().trim()));

                if (hasNameValidationError() || hasEmailValidationError()) {
                    return;
                }

                localStorage.setItem(userNameKey, name());
                localStorage.setItem(userMailKey, email());

                postUserComment(name(), email(), text(), courseId);
            }
        };

    function postUserComment(username, usermail, comment, courseId) {
        isSaved(false);
        isFailed(false);

        $.ajax({
            url: '/api/comment/create',
            data: { courseId: courseId, text: comment.trim(), createdByName: username.trim(), createdBy: usermail.trim() },
            type: 'POST'
        }).done(function (response) {
            if (response) {
                if (response.success) {
                    showIdentifyUserForm(false);
                    isSaved(true);
                    text('');
                } else {
                    isFailed(true);
                }
            } else {
                throw 'Response is not an object';
            }
        }).fail(function () {
            isFailed(true);
        });
    };

    return {
        isExpanded: isExpanded,
        text: text,
        name: name,
        email: email,
        onTextFocused: onTextFocused,
        onCollapsed: onCollapsed,
        toggleVisiblity: toggleVisiblity,
        hasValidationError: hasValidationError,
        hasNameValidationError: hasNameValidationError,
        hasEmailValidationError: hasEmailValidationError,
        isSaved: isSaved,
        isFailed: isFailed,
        addComment: addComment,
        showIdentifyUserForm: showIdentifyUserForm
    };
};