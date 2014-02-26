var app = app || {};

app.passwordRecoveryViewModel = function () {
    var digitRegex = /\d/,
        whitespaceRegex = /\s/;

    var password = ko.observable(''),
        isPasswordVisible = ko.observable(false),
        isPasswordEditing = ko.observable(false),
        showHidePassword = function() {
            isPasswordVisible(!isPasswordVisible());
        },
        errorMessage = ko.observable(''),
        hasError = ko.computed(function() {
            return !!(errorMessage() && errorMessage().length);
        });

    password.isValid = ko.computed(function () {
        return password().length >= 7
            && password().toLowerCase() != password()
            && password().toUpperCase() != password()
            && digitRegex.test(password())
            && !whitespaceRegex.test(password());
    });
    
    password.hasUpperAndLowerCaseLetters = ko.computed(function () {
        return password().toLowerCase() != password()
            && password().toUpperCase() != password();
    });

    password.hasNumbers = ko.computed(function () {
        return digitRegex.test(password());
    });

    password.hasSpaces = ko.computed(function () {
        return !whitespaceRegex.test(password())
            && password().length != 0;
    });

    password.hasMoreThanSevenSymbols = ko.computed(function () {
        return password().length >= 7;
    });

    var canSubmit = ko.computed(function() {
        return password.isValid();
    });

    return {
        password: password,
        isPasswordVisible: isPasswordVisible,
        isPasswordEditing: isPasswordEditing,

        errorMessage: errorMessage,
        hasError: hasError,

        showHidePassword: showHidePassword,
        canSubmit: canSubmit
    };
};