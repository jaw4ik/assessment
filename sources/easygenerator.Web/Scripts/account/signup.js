function signupModel() {
    var userName = ko.observable(''),
        password = ko.observable(''),
        fullName = ko.observable(''),
        phone = ko.observable(''),
        organization = ko.observable(''),
        country = ko.observable(''),
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
                data: { email: userName().trim().toLowerCase(), password: password(), fullName: fullName(), phone: phone(), organization: organization(), country: country()},
                type: 'POST'
            })
            .done(function() {
                window.location.replace('/');
            });
        },

        checkUserExists = function () {
            if (this.userPreciselyExists()) {
                return;
            }

            userExists(false);
            if (!userName.isValid()) {
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
        var mailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/,
            length = userName().trim().length;
        return length > 0 && length < 255 && mailRegex.test(userName().trim()) && !userExists();
    });

    password.isValid = ko.computed(function () {
        var digitRegex = /\d/,
            whitespaceRegex = /\s/;

        return password().length >= 7
            && password().toLowerCase() != password()
            && password().toUpperCase() != password()
            && digitRegex.test(password())
            && !whitespaceRegex.test(password());
    });

    userName.subscribe(function (newValue) {
        if (userName() != newValue)
            userExists(false);
    });

    return {
        userName: userName,
        password: password,
        fullName: fullName,
        phone: phone,
        organization: organization,
        country: country,
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