define(function (require) {
    "use strict";

    var
        app = require('durandal/app'),
        constants = require('constants'),
        ctor = require('viewmodels/courses/collaboration/collaborator'),
        localizationManager = require('localization/localizationManager'),
        notify = require('notify')
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
            spyOn(notify, 'error');
            spyOn(notify, 'success');
        });

        describe('email:', function () {

            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });
                expect(viewModel.email).toBe(email);
            });

        });

        describe('displayName:', function () {

            it('should be observable', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true, id: 'id' });
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
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, id: 'id' });
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
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, id: 'id' });
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
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: true, id: 'id' });
                expect(viewModel.registered).toBeObservable();
            });

        });

        describe('createdOn', function () {

            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.createdOn).toBeDefined();
            });

        });

        describe('deletingStarted:', function () {
            beforeEach(function() {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
            });
            it('should be function', function() {
                expect(viewModel.deletingStarted).toBeFunction();
            });

            it('should set isRemoving to true', function() {
                viewModel.isRemoving(false);
                viewModel.deletingStarted();
                expect(viewModel.isRemoving()).toBeTruthy();
            });

            it('should set showRemoveConfirmation to false', function () {
                viewModel.showRemoveConfirmation(true);
                viewModel.deletingStarted();
                expect(viewModel.showRemoveConfirmation()).toBeFalsy();
            });
        });

        describe('deletingFailed:', function () {
            beforeEach(function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
            });
            it('should be function', function () {
                expect(viewModel.deletingFailed).toBeFunction();
            });

            it('should set isRemoving to true', function () {
                viewModel.isRemoving(true);
                viewModel.deletingFailed();
                expect(viewModel.isRemoving()).toBeFalsy();
            });

            it('should notify about error', function () {
                spyOn(localizationManager, 'localize').and.returnValue('error');
                viewModel.deletingFailed();
                expect(notify.error).toHaveBeenCalledWith('error');
            });
        });

        describe('deletingCompleted:', function () {
            beforeEach(function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
            });
            it('should be function', function () {
                expect(viewModel.deletingCompleted).toBeFunction();
            });

            it('should set isRemoving to true', function () {
                viewModel.isRemoving(true);
                viewModel.deletingCompleted();
                expect(viewModel.isRemoving()).toBeFalsy();
            });

            it('should notify about success', function () {
                spyOn(localizationManager, 'localize').and.callFake(function (paramName) {
                    if (paramName === 'collaboratorWasRemoved') {
                        return 'collaboratorWasRemoved';
                    }
                    else if (paramName === 'collaboratorWasRemovedEnd') {
                        return 'collaboratorWasRemovedEnd';
                    }
                });
                viewModel.deletingCompleted();
                expect(notify.success).toHaveBeenCalledWith('collaboratorWasRemoved' + viewModel.name + 'collaboratorWasRemovedEnd');
            });
        });

        describe('name:', function () {

            beforeEach(function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
            });

            it('should be defined', function() {
                expect(viewModel.name).toBeDefined();
            });

            it('should be equal to fullname if exists', function() {
                expect(viewModel.name).toBe(fullName);
            });

            it('should be equal to email if fullname is null', function () {
                viewModel = ctor(ownerEmail, { fullName: null, email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.name).toBe(email);
            });

            it('should be equal to email if fullname is undefined', function () {
                viewModel = ctor(ownerEmail, { fullName: undefined, email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.name).toBe(email);
            });

            it('should be equal to email if fullname is empty string', function () {
                viewModel = ctor(ownerEmail, { fullName: '', email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.name).toBe(email);
            });

            it('should be equal to email if fullname is whitespace string', function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.name).toBe(email);
            });
        });

        describe('showRemoveConfirmation:', function() {
            it('should be observable', function() {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.showRemoveConfirmation).toBeObservable();
            });

            it('should be false by default', function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.showRemoveConfirmation()).toBeFalsy();
            });
        });

        describe('changeShowRemoveConfirmation:', function() {
            beforeEach(function() {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
            });

            it('should show removeCollaborationDialog', function () {
                spyOn(viewModel.removeCollaboratorDialog, 'show');
                viewModel.changeShowRemoveConfirmation();
                expect(viewModel.removeCollaboratorDialog.show).toHaveBeenCalled();
            });

            it('should set showRemoveConfirmation to true', function() {
                viewModel.showRemoveConfirmation(false);
                viewModel.changeShowRemoveConfirmation();
                expect(viewModel.showRemoveConfirmation()).toBeTruthy();
            });
        });

        describe('removeCollaboratorDialog:', function() {
            it('should be object', function() {
                expect(viewModel.removeCollaboratorDialog).toBeObject();
            });
        });

        describe('isRemoving:', function () {
            beforeEach(function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
            });

            it('shoud be observable', function() {
                expect(viewModel.isRemoving).toBeObservable();
            });

            it('shoud be true by default if collaborator is deleting', function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: 'deleting' });
                expect(viewModel.isRemoving()).toBeTruthy();
            });

            it('shoud be false by default if collaborator is not deleting', function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.isRemoving()).toBeFalsy();
            });
        });

        describe('deactivate', function () {

            it('should be a function', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should unsubscribe from collaboratorRegister event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRegistered + email, viewModel.collaboratorRegistered);
            });

            it('should unsubscribe from deleting.started event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.started + 'id', viewModel.deletingStarted);
            });

            it('should unsubscribe from deleting.failed event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.failed + 'id', viewModel.deletingFailed);
            });

            it('should unsubscribe from deleting.completed event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.completed + 'id', viewModel.deletingCompleted);
            });
        });

        describe('when collaborator is not registered', function () {

            it('should subscribe for collaboratorRegistered event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

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

        describe('when collaborator is not owner', function() {
            beforeEach(function () {
                viewModel = ctor(ownerEmail, { id: 'id', fullName: '  ', email: email, createdOn: new Date(), state: '' });
            });

            it('should subscribe to deleting.started event', function () {
                
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.started + 'id', viewModel.deletingStarted);
            });

            it('should subscribe to deleting.failed event', function () {
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.failed + 'id', viewModel.deletingFailed);
            });

            it('should subscribe to deleting.completed event', function () {
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.completed + 'id', viewModel.deletingCompleted);
            });
        });

    });
})