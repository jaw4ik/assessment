var app = app || {};

app.signinViewModel = function () {

    var
        username = ko.observable(),
        password = ko.observable(),

        isPasswordVisible = ko.observable(),
        togglePasswordVisibility = function () {
            isPasswordVisible(!isPasswordVisible());
        },

        errorMessage = ko.observable(),
        hasError = ko.computed(function () {
            return !!(errorMessage() && errorMessage().length);
        }),

        canSubmit = ko.computed(function () {
            return !!(username() && password() && username().trim().length && password().trim().length);
        }),

        submit = function () {
            if (!canSubmit()) {
                return;
            }

            errorMessage("");

            var data = {
                username: username().trim().toLowerCase(),
                password: password()
            };

            var that = this;

            $.ajax({
                url: '/api/user/signin',
                data: data,
                type: 'POST'
            })
            .done(function (response) {
                if (response) {
                    if (response.success) {
                        app.openHomePage();
                    } else {
                        if (response.message) {
                            that.errorMessage(response.message);
                        } else {
                            throw 'Error message is not defined';
                        }
                    }
                } else {
                    throw 'Response is not an object';
                }
            })
            .fail(function (reason) {
                that.errorMessage(reason);
            });
        };

    return {
        username: username,
        password: password,
        isPasswordVisible: isPasswordVisible,
        togglePasswordVisibility: togglePasswordVisibility,

        canSubmit: canSubmit,
        submit: submit,

        hasError: hasError,
        errorMessage: errorMessage
    };

};