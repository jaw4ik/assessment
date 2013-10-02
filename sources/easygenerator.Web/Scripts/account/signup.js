function signupModel() {
    var userName = ko.observable(''),
        password = ko.observable(''),
        isLicenseAgreed = ko.observable(false),
        isPasswordEditing = ko.observable(false),
        isPasswordVisible = ko.observable(false),
        userExists = ko.observable(false),
        
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
            if (userName().trim() == '') {
                userExists(false);
                return;
            }

            $.ajax({
                url: '/api/user/exists',
                data: { email: userName() },
                type: 'POST'
            })
            .done(function(response) {
                userExists(response.data);
            });
        },

        resetUserExists = function () {
            userExists(false);
        };

    userName.isValid = ko.computed(function () {
        var mailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
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

    return {
        userName: userName,
        password: password,
        isLicenseAgreed: isLicenseAgreed,
        isPasswordEditing: isPasswordEditing,
        isPasswordVisible: isPasswordVisible,
        userExists: userExists,

        showHidePassword: showHidePassword,
        checkUserExists: checkUserExists,
        resetUserExists: resetUserExists,
        signUp: signUp
    };
}

$(function () {
    ko.applyBindings(signupModel(), $(".sign-up")[0]);
});