﻿function signupModel() {
    var userName = ko.observable(''),
        password = ko.observable(''),
        isLicenseAgreed = ko.observable(false),
        isUserNameEditing = ko.observable(false),
        isPasswordEditing = ko.observable(false),
        isPasswordVisible = ko.observable(false),
        userExists = ko.observable(false),
        lastValidatedUserName = null,
        userPreciselyExists = ko.computed(function () {
            return userExists() && userName() === lastValidatedUserName;
        }),
        
        showHidePassword = function () {
            isPasswordVisible(!isPasswordVisible());
        },

        signUp = function() {
            $.ajax({
                url: '/api/user/signup',
                data: { email: userName(), password: password() },
                type: 'POST'
            })
            .done(function () {
                window.location.href = '/';
            });
        },

        checkUserExists = function () {
            if (userPreciselyExists()) {
                return;
            }

            if (userName().trim() == '') {
                userExists(false);
                return;
            }
            lastValidatedUserName = userName();
            $.ajax({
                url: '/api/user/exists',
                data: { email: userName() },
                type: 'POST'
            })
            .done(function(response) {
                userExists(response.data);
            });
        };

    userName.isValid = ko.computed(function () {
        var mailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/;
        return userName().trim().length > 0 && mailRegex.test(userName()) && !userExists();
    });

    password.isValid = ko.computed(function () {
        var digitRegex = /\d/,
            specialCharacterRegex = /\W/,
            whitespaceRegex = /\s/;

        return password().length >= 7
            && password().toLowerCase() != password()
            && password().toUpperCase() != password()
            && digitRegex.test(password())
            && specialCharacterRegex.test(password())
            && !whitespaceRegex.test(password());
    });

    userName.subscribe(function (newValue) {
        if (userName() != newValue)
            userExists(false);
    });

    return {
        userName: userName,
        password: password,
        isLicenseAgreed: isLicenseAgreed,
        isUserNameEditing: isUserNameEditing,
        isPasswordEditing: isPasswordEditing,
        isPasswordVisible: isPasswordVisible,
        userExists: userExists,
        userPreciselyExists: userPreciselyExists,

        showHidePassword: showHidePassword,
        checkUserExists: checkUserExists,
        signUp: signUp
    };
}

$(function () {
    ko.applyBindings(signupModel(), $(".sign-up")[0]);
});