function signupModel() {
    var userName = ko.observable(''),
        password = ko.observable(''),
        isLicenseAgreed = ko.observable(false),
        isUserNameEditing = ko.observable(false),
        isUserNameValidating = ko.observable(false),
        isPasswordEditing = ko.observable(false),
        isPasswordVisible = ko.observable(false),
        userExists = ko.observable(false),
        lastValidatedUserName = null,
        userPreciselyExists = ko.computed(function () {
            return userExists() && userName().trim().toLowerCase() === lastValidatedUserName;
        }),

        showHidePassword = function () {
            isPasswordVisible(!isPasswordVisible());
        },

        signUp = function() {
            $.ajax({
                url: '/api/user/signup',
                data: { email: userName().trim().toLowerCase(), password: password() },
                type: 'POST'
            })
            .done(function () {
                window.location.replace('/');
            });
        },

        checkUserExists = function () {
            if (this.userPreciselyExists()) {
                return;
            }

            userExists(false);
            if (userName().trim() == '') {
                return;
            }

            lastValidatedUserName = userName().trim().toLowerCase();
            isUserNameValidating(true);

            $.ajax({
                url: '/api/user/exists',
                data: { email: userName().trim().toLowerCase() },
                type: 'POST'
            })
            .done(function(response) {
                userExists(response.data);
                isUserNameValidating(false);
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
        isUserNameValidating: isUserNameValidating,
        isPasswordEditing: isPasswordEditing,
        isPasswordVisible: isPasswordVisible,
        userExists: userExists,
        userPreciselyExists: userPreciselyExists,

        showHidePassword: showHidePassword,
        checkUserExists: checkUserExists,
        signUp: signUp
    };
}