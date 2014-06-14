define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/courses/collaboration/collaborator'),
        localizationManager = require('localization/localizationManager')
    ;

    describe('viewModel [collaborator]', function () {

        var viewModel,
        ownerEmail = "user@user.com",
        email = "email@user.com",
        fullName = "Full Name",
        owner = 'owner';
        
        describe('displayName:', function () {
            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true });
                expect(viewModel.displayName).toBeDefined();
            });

            describe('when collaborator fullName is defined', function () {

                describe('and when collaborator is course owner', function () {
                    it('should be equal to collaborator fullName plus owner', function () {
                        spyOn(localizationManager, 'localize').and.returnValue(owner);
                        viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true });
                        expect(viewModel.displayName).toBe(fullName + ': ' + owner);
                    });
                });

                describe('and when collabortor is not registered', function() {
                    
                    it('should be equal to collaborator email plus waiting for registration', function () {
                        spyOn(localizationManager, 'localize').and.returnValue('waiting for registration...');
                        viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: false });
                        expect(viewModel.displayName).toBe(fullName + ':\nwaiting for registration...');
                    });

                });

                it('should be equal to collaborator fullName', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: true });
                    expect(viewModel.displayName).toBe(fullName);
                });

            });

            describe('when collaborator fullName is not defined', function () {
                beforeEach(function () {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: true });
                });

                describe('and when is not a course owner', function () {
                    it('should be equal to collaborator fullName', function () {
                        viewModel = ctor(ownerEmail, { fullName: '', email: email, registered: true });
                        expect(viewModel.displayName).toBe(email);
                    });
                });

                describe('and when is course owner', function () {
                    it('should be equal to collaborator fullName plus owner', function () {
                        spyOn(localizationManager, 'localize').and.returnValue(owner);
                        viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: true });
                        expect(viewModel.displayName).toBe(ownerEmail + ': ' + owner);
                    });
                });
            });
        });

        describe('avatarLetter:', function () {
            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.avatarLetter).toBeDefined();
            });

            describe('when collaborator fullName is defined', function () {
                it('should be equal to first letter of collaborator fullName', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true });
                    expect(viewModel.avatarLetter).toBe(fullName.charAt(0));
                });
            });

            describe('when collaborator fullName is not defined', function () {
                it('should be equal to first letter of collaborator email', function () {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: true });
                    expect(viewModel.avatarLetter).toBe(ownerEmail.charAt(0));
                });
            });

            describe('when collaborator is not registered', function() {
                it('should be \'?\'', function() {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: false });
                    expect(viewModel.avatarLetter).toBe('?');
                });
            });
        });

        describe('isOwner:', function () {
            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.isOwner).toBeDefined();
            });

            describe('when collaborator is owner', function () {
                it('should be true', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                    expect(viewModel.isOwner).toBeTruthy();
                });
            });

            describe('when collaborator is not owner', function () {
                it('should be false', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: 'oppa@some.style' });
                    expect(viewModel.isOwner).toBeFalsy();
                });
            });
        });

        describe('id:', function () {
            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, id: 'id' });
                expect(viewModel.id).toBeDefined();
            });
        });

        describe('registered:', function () {

            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true });
                expect(viewModel.registered).toBeDefined();
            });

        });

    });
})