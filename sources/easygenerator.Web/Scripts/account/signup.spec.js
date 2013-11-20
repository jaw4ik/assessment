define([], function () {
    "use strict";

    var viewModel;

    describe('viewModel [signUp]', function () {

        beforeEach(function () {
            viewModel = signupModel();
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('userName:', function () {

            it('should be observable', function () {
                expect(viewModel.userName).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.userName.isValid).toBeComputed();
                });

            });

            describe('when empty', function () {

                it('should be not valid', function () {
                    viewModel.userName('');
                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when not e-mail', function () {

                it('should be not valid', function () {
                    viewModel.userName('Username');
                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when e-mail length bigger than 254', function () {

                it('should be not valid', function () {
                    viewModel.userName(utils.createString(250) + '@t.ru');
                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when user with such e-mail exists', function () {

                it('should be not valid', function () {
                    viewModel.userName('test@mail.com');
                    viewModel.userExists(true);

                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when meet all requirements', function () {

                it('should be valid', function () {
                    viewModel.userName('test@mail.com');
                    viewModel.userExists(false);

                    expect(viewModel.userName.isValid()).toBeTruthy();
                });

            });

        });

        describe('fullName:', function () {

            it('should be observable', function () {
                expect(viewModel.fullName).toBeObservable();
            });

            describe('isValid:', function() {
               
                it('should be computed', function () {
                    expect(viewModel.fullName.isValid).toBeComputed();
                });

            });

            describe('when empty', function() {

                it('should be not valid', function () {
                    viewModel.fullName('');
                    expect(viewModel.fullName.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function() {

                it('should be valid', function() {
                    viewModel.fullName('Some name');
                    expect(viewModel.fullName.isValid()).toBeTruthy();
                });

            });
        });

        describe('phone:', function () {

            it('should be observable', function () {
                expect(viewModel.phone).toBeObservable();
            });

            describe('isValid:', function() {

                it('should be computed', function() {
                    expect(viewModel.phone.isValid).toBeComputed();
                });

            });

            describe('when empty', function() {

                it('should be not valid', function() {
                    viewModel.phone('');
                    expect(viewModel.phone.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function() {

                it('should be valid', function() {
                    viewModel.phone('some phone');
                    expect(viewModel.phone.isValid()).toBeTruthy();
                });

            });

        });

        describe('organization:', function () {

            it('should be observable', function () {
                expect(viewModel.organization).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.organization.isValid).toBeComputed();
                });

            });

            describe('when empty', function () {

                it('should be not valid', function () {
                    viewModel.organization('');
                    expect(viewModel.organization.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function () {

                it('should be valid', function () {
                    viewModel.organization('some organization');
                    expect(viewModel.organization.isValid()).toBeTruthy();
                });

            });
            
        });
        
        describe('country:', function () {

            it('should be observable', function () {
                expect(viewModel.country).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.country.isValid).toBeComputed();
                });

            });

            describe('when null', function () {

                it('should be not valid', function () {
                    viewModel.country(null);
                    expect(viewModel.country.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function () {

                it('should be valid', function () {
                    viewModel.country('some country');
                    expect(viewModel.country.isValid()).toBeTruthy();
                });

                it('should set phone code', function() {
                    viewModel.country('Ukraine');
                    expect(viewModel.phoneCode()).toBe('+ 380');
                });

            });

        });

        describe('isFormValid:', function() {

            it('should be computed', function() {
                expect(viewModel.isFormValid).toBeComputed();
            });

            describe('when all data valid', function() {

                it('should be valid', function() {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.fullName('some fullName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeTruthy();
                });

            });

            describe('when all data not valid', function() {
                
                it('should be not valid', function () {
                    viewModel.userName('');
                    viewModel.password('');
                    viewModel.fullName('');
                    viewModel.phone('');
                    viewModel.organization('');
                    viewModel.country(null);
                    viewModel.isLicenseAgreed(false);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when userName not valid', function() {
                
                it('should be not valid', function () {
                    viewModel.userName('');
                    viewModel.password('abcABC123');
                    viewModel.fullName('some fullName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });
            
            describe('when password not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('');
                    viewModel.fullName('some fullName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });
            
            describe('when fullName not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.fullName('');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });
            
            describe('when phone not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.fullName('some fullName');
                    viewModel.phone('');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });
            
            describe('when organization not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.fullName('some fullName');
                    viewModel.phone('some phone');
                    viewModel.organization('');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });
            
            describe('when country not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.fullName('some fullName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country(null);
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when isLicenseAgreed not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.fullName('some fullName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(false);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });
            
        });

        describe('isUserNameEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isUserNameEditing).toBeObservable();
            });

        });

        describe('password:', function () {

            it('should be observable', function () {
                expect(viewModel.password).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.password.isValid).toBeComputed();
                });

            });

            describe('when is empty', function () {

                it('should be not valid', function () {
                    viewModel.password('');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when less than 7 characters', function () {

                it('should be not valid', function () {
                    viewModel.password('some');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when not contain upper case letter', function () {

                it('should be not valid', function () {
                    viewModel.password('password');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when not contain lower case letter', function () {

                it('should be not valid', function () {
                    viewModel.password('PASSWORD');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when not contain digit', function () {

                it('should be not valid', function () {
                    viewModel.password('Password');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when contain whitespace', function () {

                it('should be not valid', function () {
                    viewModel.password('Pass word1!');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when meet all requirements', function () {

                it('should be valid', function () {
                    viewModel.password('Password1!');
                    expect(viewModel.password.isValid()).toBeTruthy();
                });

            });

        });

        describe('isPasswordEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordEditing).toBeObservable();
            });

        });

        describe('isPasswordVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordVisible).toBeObservable();
            });

        });

        describe('showHidePassword:', function () {

            it('should be a function', function () {
                expect(viewModel.showHidePassword).toBeFunction();
            });

            describe('when password is not visible', function () {

                it('should show password', function () {
                    viewModel.isPasswordVisible(true);
                    viewModel.showHidePassword();
                    expect(viewModel.isPasswordVisible()).toBeFalsy();
                });

            });

            describe('when password is visible', function () {

                it('should hide password', function () {
                    viewModel.isPasswordVisible(true);
                    viewModel.showHidePassword();
                    expect(viewModel.isPasswordVisible()).toBeFalsy();
                });

            });

        });

        describe('isLicenseAgreed:', function () {

            it('should be observable', function () {
                expect(viewModel.isLicenseAgreed).toBeObservable();
            });

        });

        describe('userExists:', function () {

            it('should be observable', function () {
                expect(viewModel.userExists).toBeObservable();
            });

        });

        describe('userPreciselyExists:', function () {

            it('should be computed', function () {
                expect(viewModel.userPreciselyExists).toBeComputed();
            });

        });

        describe('isUserNameValidating:', function () {

            it('should be observable', function () {
                expect(viewModel.isUserNameValidating).toBeObservable();
            });

        });

        describe('checkUserExists:', function () {

            it('should be a function', function () {
                expect(viewModel.checkUserExists).toBeFunction();
            });

            describe('when user precisely exists', function () {

                it('should not set \"userExists\"', function () {
                    viewModel.userExists(null);
                    spyOn(viewModel, "userPreciselyExists").andReturn(true);

                    viewModel.checkUserExists();
                    expect(viewModel.userExists()).toBeNull();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    spyOn(viewModel, "userPreciselyExists").andReturn(true);

                    viewModel.checkUserExists();
                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is empty', function () {

                it('should set \"userExists\" false', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('');
                    viewModel.userExists(null);
                    viewModel.checkUserExists();

                    expect(viewModel.userExists()).toBeFalsy();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('');
                    viewModel.checkUserExists();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is not e-mail', function () {

                it('should set \"userExists\" false', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('invalid mail');
                    viewModel.userExists(null);
                    viewModel.checkUserExists();

                    expect(viewModel.userExists()).toBeFalsy();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('invalid mail');
                    viewModel.checkUserExists();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is valid e-mail', function () {

                it('should call \"/api/user/exists"', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('user@mail.com');
                    viewModel.checkUserExists();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/api/user/exists',
                        data: { email: 'user@mail.com' },
                        type: 'POST'
                    });
                });

                it('should set \"isUserValidating\" true', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('user@mail.com');
                    viewModel.isUserNameValidating(null);

                    viewModel.checkUserExists();

                    expect(viewModel.isUserNameValidating()).toBeTruthy();
                });

            });

            describe('when request succeed', function () {

                var deferred,
                    promise;

                beforeEach(function () {
                    deferred = $.Deferred(),
                    promise = deferred.promise().always(function () { });
                    spyOn($, 'ajax').andReturn(deferred.promise());
                });

                describe('and user exists', function () {

                    it('should set \"userExists\" true', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.userExists()).toBeTruthy();
                        });
                    });

                    it('should change \"userPreciselyExists\" in true', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.userPreciselyExists()).toBeTruthy();
                        });
                    });

                    describe('and userName is changed', function () {

                        it('should change \"userPreciselyExists\" in false', function () {
                            viewModel.userName('user@mail.com');
                            viewModel.userExists(null);
                            deferred.resolve({ data: true });

                            viewModel.checkUserExists();

                            waitsFor(function () {
                                return promise.state() != "pending";
                            });

                            runs(function () {
                                viewModel.userName('newMail');
                                expect(viewModel.userPreciselyExists()).toBeFalsy();
                            });

                        });

                    });

                    it('should set \"isUserNameValidating\" false', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.isUserNameValidating(null);
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.isUserNameValidating()).toBeFalsy();
                        });
                    });

                });

                describe('and user not exists', function () {

                    it('should set \"userExists\" false', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: false });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.userExists()).toBeFalsy();
                        });
                    });

                    it('should set \"isUserNameValidating\" false', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.isUserNameValidating(null);
                        deferred.resolve({ data: false });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.isUserNameValidating()).toBeFalsy();
                        });
                    });

                });

            });

        });

        describe('signUp:', function () {

            it('should be a function', function () {
                expect(viewModel.signUp).toBeFunction();
            });

            var ajax;
            beforeEach(function () {
                ajax = $.Deferred();
                spyOn($, 'ajax').andReturn(ajax.promise());
            });

            it('should call \"/api/user/signupfirststep"', function () {
                viewModel.userName('anonymous@easygenerator.com');
                viewModel.password('abcABC123');
                viewModel.fullName('some fullName');
                viewModel.phone('some phone');
                viewModel.organization('some organization');
                viewModel.country('some country');
                
                viewModel.signUp();

                expect($.ajax).toHaveBeenCalledWith({
                    url: '/api/user/signupfirststep',
                    data: { email: viewModel.userName(), password: viewModel.password(), fullName: viewModel.fullName(), phone: viewModel.phone(), organization: viewModel.organization(), country: viewModel.country() },
                    type: 'POST'
                });
            });

        });

        describe('isFullNameErrorVisible:', function () {

            it('should be observable', function() {
                expect(viewModel.isFullNameErrorVisible).toBeObservable();
            });

        });

        describe('isPhoneErrorVisible:', function () {

            it('should be observable', function() {
                expect(viewModel.isPhoneErrorVisible).toBeObservable();
            });

        });

        describe('isOrganizationErrorVisible', function() {

            it('should be observable', function() {
                expect(viewModel.isOrganizationErrorVisible).toBeObservable();
            });

        });
        
        describe('isCountrySuccessVisible', function () {

            it('should be observable', function () {
                expect(viewModel.isCountrySuccessVisible).toBeObservable();
            });

        });

        describe('onFocusFullName:', function () {

            it('should be function', function() {
                expect(viewModel.onFocusFullName).toBeFunction();
            });

            it('should set isFullNameErrorVisible to false', function () {
                viewModel.isFullNameErrorVisible(true);
                viewModel.onFocusFullName();
                expect(viewModel.isFullNameErrorVisible()).toBeFalsy();
            });

        });
        
        describe('onFocusPhone:', function () {

            it('should be function', function () {
                expect(viewModel.onFocusPhone).toBeFunction();
            });

            it('should set isPhoneErrorVisible to false', function () {
                viewModel.isPhoneErrorVisible(true);
                viewModel.onFocusPhone();
                expect(viewModel.isPhoneErrorVisible()).toBeFalsy();
            });

        });
        
        describe('onFocusOrganization:', function () {

            it('should be function', function () {
                expect(viewModel.onFocusOrganization).toBeFunction();
            });

            it('should set isOrganizationErrorVisible to false', function () {
                viewModel.isOrganizationErrorVisible(true);
                viewModel.onFocusOrganization();
                expect(viewModel.isOrganizationErrorVisible()).toBeFalsy();
            });

        });

        describe('validateFullName:', function () {

            it('should be function', function() {
                expect(viewModel.validateFullName).toBeFunction();
            });

            describe('when fullname has only whitespaces', function() {

                it('should be set isFullNameErrorVisible to true', function () {
                    viewModel.fullName('        ');
                    viewModel.isFullNameErrorVisible(false);
                    viewModel.validateFullName();
                    expect(viewModel.isFullNameErrorVisible()).toBeTruthy();
                });

            });
            
            describe('when fullname not has only whitespaces', function () {

                it('should be set isFullNameErrorVisible to false', function () {
                    viewModel.fullName('    some full name    ');
                    viewModel.isFullNameErrorVisible(true);
                    viewModel.validateFullName();
                    expect(viewModel.isFullNameErrorVisible()).toBeFalsy();
                });

            });

        });

        describe('validatePhone:', function () {
            
            it('should be function', function () {
                expect(viewModel.validatePhone).toBeFunction();
            });
            
            describe('when phone has only whitespaces', function () {

                it('should be set isPhoneErrorVisible to true', function () {
                    viewModel.phone('        ');
                    viewModel.isPhoneErrorVisible(false);
                    viewModel.validatePhone();
                    expect(viewModel.isPhoneErrorVisible()).toBeTruthy();
                });

            });

            describe('when phone not has only whitespaces', function () {

                it('should be set isFullNameErrorVisible to false', function () {
                    viewModel.phone('    some phone    ');
                    viewModel.isPhoneErrorVisible(true);
                    viewModel.validatePhone();
                    expect(viewModel.isPhoneErrorVisible()).toBeFalsy();
                });

            });

        });

        describe('validateOrganization:', function () {
            
            it('should be function', function () {
                expect(viewModel.validateOrganization).toBeFunction();
            });

            describe('when organization has only whitespaces', function () {

                it('should be set isOrganizationErrorVisible to true', function () {
                    viewModel.organization('        ');
                    viewModel.isOrganizationErrorVisible(false);
                    viewModel.validateOrganization();
                    expect(viewModel.isOrganizationErrorVisible()).toBeTruthy();
                });

            });

            describe('when organization not has only whitespaces', function () {

                it('should be set isOrganizationErrorVisible to false', function () {
                    viewModel.organization('    some organization    ');
                    viewModel.isOrganizationErrorVisible(true);
                    viewModel.validateOrganization();
                    expect(viewModel.isOrganizationErrorVisible()).toBeFalsy();
                });

            });
        });

        describe('phoneCode:', function() {

            it('should be observable', function() {
                expect(viewModel.phoneCode).toBeObservable();
            });

            it('should be equal \'+ ( ... )\'', function () {
                expect(viewModel.phoneCode()).toEqual('+ ( ... )');
            });

        });
    });

});