define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/courses/collaboration/collaborator')
    ;

    describe('viewModel [collaborator]', function () {

        var viewModel;
        var ownerEmail = "user@user.com";
        var fullName = "Full Name";

        beforeEach(function () {
        });

        describe('name', function() {
            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.name).toBeDefined();
            });

            describe('when collaborator fullName is defined', function () {
                it('should be equal to collaborator fullName', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                    expect(viewModel.name).toBe(fullName);
                });
            });

            describe('when collaborator fullName is not defined', function () {
                it('should be equal to collaborator email', function () {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail });
                    expect(viewModel.name).toBe(ownerEmail);
                });
            });
        });

        describe('avatarLetter', function () {
            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.avatarLetter).toBeDefined();
            });

            describe('when collaborator fullName is defined', function () {
                it('should be equal to first letter of collaborator fullName', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                    expect(viewModel.avatarLetter).toBe(fullName.charAt(0));
                });
            });

            describe('when collaborator fullName is not defined', function () {
                it('should be equal to first letter of collaborator email', function () {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail });
                    expect(viewModel.avatarLetter).toBe(ownerEmail.charAt(0));
                });
            });
        });

        describe('isOwner', function () {
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
       
    });
})