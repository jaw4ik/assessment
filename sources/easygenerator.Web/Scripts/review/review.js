var app = app || {};

app.reviewViewModel = () => {
    'use strict';

    const patternEmail = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/,
        userNameKey = 'usernameForReview',
        userMailKey = 'usermailForReview';

    var text = ko.observable(),
        name = ko.observable(''),
        email = ko.observable(''),

        showTextValidationError = ko.observable(false),
        showNameValidationError = ko.observable(false),
        showEmailValidationError = ko.observable(false),
        showIdentifyUserForm = ko.observable(false),

        isExpanded = ko.observable(false),
        isSaved = ko.observable(false),
        isFailed = ko.observable(false),

        toggleVisiblity = () => {
            isExpanded(!isExpanded());
        },

        onTextFocused = () => {
            showTextValidationError(false);
        },

        onCollapsed = () => {
            isSaved(false);
            isFailed(false);
        },

        addComment = (courseId) => {
            if (_.isNullOrUndefined(courseId)) {
                throw 'Course id is not specified';
            }

            if (!text() || _.isEmptyOrWhitespace(text())) {
                showTextValidationError(true);
                return;
            }

            if (showIdentifyUserForm()) {
                showNameValidationError(!name() || !name().trim());
                showEmailValidationError(!email() || !patternEmail.test(email().trim()));

                if (showNameValidationError() || showEmailValidationError()) {
                    return;
                }

                localStorage.setItem(userNameKey, name());
                localStorage.setItem(userMailKey, email());
            }

            let username = localStorage.getItem(userNameKey),
                usermail = localStorage.getItem(userMailKey);

            if (!username || !username.trim() || !usermail || !usermail.trim()) {
                showIdentifyUserForm(true);
                return;
            }

            postUserComment(username, usermail, text(), courseId);
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
        text: text,
        name: name,
        email: email,

        showIdentifyUserForm: showIdentifyUserForm,
        showTextValidationError: showTextValidationError,
        showNameValidationError: showNameValidationError,
        showEmailValidationError: showEmailValidationError,

        onTextFocused: onTextFocused,
        onCollapsed: onCollapsed,

        isExpanded: isExpanded,
        isSaved: isSaved,
        isFailed: isFailed,
        toggleVisiblity: toggleVisiblity,
        
        addComment: addComment
    };
};