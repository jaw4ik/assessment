var app = app || {};

app.reviewViewModel = function () {

    var isExpanded = ko.observable(false),
        text = ko.observable(),
        name = ko.observable(''),
        email = ko.observable(''),
        hasValidationError = ko.observable(false),
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

            isSaved(false);
            isFailed(false);

            if (!text() || _.isEmptyOrWhitespace(text()) ||
                !name() || _.isEmptyOrWhitespace(name()) ||
                !email() || _.isEmptyOrWhitespace(email())) {
                hasValidationError(true);
                return;
            }

            var that = this;

            $.ajax({
                url: '/api/comment/create',
                data: { courseId: courseId, text: text().trim(), createdByName: name().trim(), createdBy: email().trim() },
                type: 'POST'
            }).done(function (response) {
                if (response) {
                    if (response.success) {
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
        isSaved: isSaved,
        isFailed: isFailed,
        addComment: addComment
    };
};