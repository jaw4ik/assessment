function signupModel() {
    var userName = ko.observable(''),
        password = ko.observable(''),
        isLicenseAgreed = ko.observable(false),
        isPasswordEditing = ko.observable(false),
        isPasswordVisible = ko.observable(false),
        
        showHidePassword = function () {
            isPasswordVisible(!isPasswordVisible());
        };

    userName.isValid = ko.computed(function () {
        var mailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
        return userName().trim().length > 0 && mailRegex.test(userName());
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
        
        showHidePassword: showHidePassword
    };
}