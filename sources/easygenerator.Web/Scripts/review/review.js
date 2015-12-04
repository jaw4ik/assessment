var app = app || {};

app.reviewViewModel = () => {
    'use strict';

    const patternEmail = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,15})+)$/,
            userNameKey = 'usernameForReview',
            userMailKey = 'usermailForReview';

    class Review {
        constructor() {
            this.text = ko.observable();
            this.name = ko.observable('');
            this.email = ko.observable('');

            this.showTextValidationError = ko.observable(false);
            this.showNameValidationError = ko.observable(false);
            this.showEmailValidationError = ko.observable(false);
            this.showIdentifyUserForm = ko.observable(false);

            this.isExpanded = ko.observable(false);
            this.isSaved = ko.observable(false);
            this.isFailed = ko.observable(false);
        }

        toggleVisiblity() {
            this.isExpanded(!this.isExpanded());
        }

        onTextFocused() {
            this.showTextValidationError(false);
        }

        onCollapsed() {
            this.isSaved(false);
            this.isFailed(false);
        }

        addComment(courseId) {
            if (_.isNullOrUndefined(courseId)) {
                throw 'Course id is not specified';
            }

            if (!this.text() || _.isEmptyOrWhitespace(this.text())) {
                this.showTextValidationError(true);
                return;
            }
            
            if (this.showIdentifyUserForm()) {
                this.showNameValidationError(!this.name() || !this.name().trim());
                this.showEmailValidationError(!this.email() || !patternEmail.test(this.email().trim()));

                if (this.showNameValidationError() || this.showEmailValidationError()) {
                    return;
                }

                localStorage.setItem(userNameKey, this.name());
                localStorage.setItem(userMailKey, this.email());
            }

            let username = localStorage.getItem(userNameKey),
                usermail = localStorage.getItem(userMailKey);

            if (!username || !username.trim() || !usermail || !usermail.trim()) {
                this.showIdentifyUserForm(true);
                return;
            }

            this.postUserComment(username, usermail, this.text(), courseId);
        }

        postUserComment(username, usermail, comment, courseId) {
            this.isSaved(false);
            this.isFailed(false);

            let that = this;

            $.ajax({
                url: '/api/comment/create',
                data: { courseId: courseId, text: comment.trim(), createdByName: username.trim(), createdBy: usermail.trim() },
                type: 'POST'
            }).done(function (response) {
                if (response) {
                    if (response.success) {
                        that.showIdentifyUserForm(false);
                        that.isSaved(true);
                        that.text('');
                    } else {
                        that.isFailed(true);
                    }
                } else {
                    throw 'Response is not an object';
                }
            }).fail(function () {
                that.isFailed(true);
            });
        }
    }

    return new Review();
};