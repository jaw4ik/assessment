define(function (require) {
    "use strict";

    var
        app = require('durandal/app'),
        constants = require('constants'),
        ctor = require('viewmodels/courses/collaboration/collaborator'),
        localizationManager = require('localization/localizationManager')
    ;

    describe('viewModel [collaborator]', function () {

        var viewModel,
        ownerEmail = "user@user.com",
        email = "email@user.com",
        fullName = "Full Name",
        owner = 'owner';

        beforeEach(function () {
            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        describe('email:', function () {

            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });
                expect(viewModel.email).toBe(email);
            });

        });

        describe('displayName:', function () {

            it('should be observable', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true });
                expect(viewModel.displayName).toBeObservable();
            });

            describe('when collaborator fullName is defined', function () {

                describe('and when collaborator is course owner', function () {

                    it('should be equal to collaborator fullName plus owner', function () {
                        spyOn(localizationManager, 'localize').and.returnValue(owner);
                        viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true });
                        expect(viewModel.displayName()).toBe(fullName + ': ' + owner);
                    });

                });

                describe('and when collabortor is not registered', function () {

                    it('should be equal to collaborator email plus waiting for registration', function () {
                        spyOn(localizationManager, 'localize').and.returnValue('waiting for registration...');
                        viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: false });
                        expect(viewModel.displayName()).toBe(fullName + ':\nwaiting for registration...');
                    });

                });

                it('should be equal to collaborator fullName', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: true });
                    expect(viewModel.displayName()).toBe(fullName);
                });

            });

            describe('when collaborator fullName is not defined', function () {
                beforeEach(function () {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: true });
                });

                describe('and when is not a course owner', function () {
                    it('should be equal to collaborator fullName', function () {
                        viewModel = ctor(ownerEmail, { fullName: '', email: email, registered: true });
                        expect(viewModel.displayName()).toBe(email);
                    });
                });

                describe('and when is course owner', function () {
                    it('should be equal to collaborator fullName plus owner', function () {
                        spyOn(localizationManager, 'localize').and.returnValue(owner);
                        viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: true });
                        expect(viewModel.displayName()).toBe(ownerEmail + ': ' + owner);
                    });
                });
            });
        });

        describe('avatarLetter:', function () {

            it('should be computed', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.avatarLetter).toBeComputed();
            });

            describe('when collaborator fullName is defined', function () {
                it('should be equal to first letter of collaborator fullName', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true });
                    expect(viewModel.avatarLetter()).toBe(fullName.charAt(0));
                });
            });

            describe('when collaborator fullName is not defined', function () {
                it('should be equal to first letter of collaborator email', function () {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: true });
                    expect(viewModel.avatarLetter()).toBe(ownerEmail.charAt(0));
                });
            });

            describe('when collaborator is not registered', function () {
                it('should be \'?\'', function () {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: false });
                    expect(viewModel.avatarLetter()).toBe('?');
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

        describe('registered:', function () {

            it('should be observable', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: true });
                expect(viewModel.registered).toBeObservable();
            });

        });

        describe('createdOn', function () {

            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date() });
                expect(viewModel.createdOn).toBeDefined();
            });

        });

        describe('deactivate', function () {

            it('should be a function', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should unsubscribe from collaboratorRegister event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRegistered + email, viewModel.collaboratorRegistered);
            });

        });

        describe('when collaborator is not registered', function () {

            it('should subscribe for collaboratorRegistered event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });

                expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRegistered + email, viewModel.collaboratorRegistered);
            });

        });

        describe('collaboratorRegistered:', function () {

            it('should be a function', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });

                expect(viewModel.collaboratorRegistered).toBeFunction();
            });

            it('should update display name', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });
                viewModel.displayName('');

                viewModel.collaboratorRegistered({ fullName: 'Registered user' });

                expect(viewModel.displayName()).toBe('Registered user');
            });

            it('should set registered to true', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: false });

                viewModel.collaboratorRegistered({ fullName: 'Registered user' });

                expect(viewModel.registered()).toBe(true);
            });

            it('should unsubscribe from collaboratorRegister event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });

                viewModel.collaboratorRegistered({ fullName: 'Registered user' });

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRegistered + email, viewModel.collaboratorRegistered);
            });

        });

    });
})