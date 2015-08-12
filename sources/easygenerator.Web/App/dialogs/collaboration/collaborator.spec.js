define(function (require) {
    "use strict";

    var
        app = require('durandal/app'),
        constants = require('constants'),
        ctor = require('dialogs/collaboration/collaborator'),
        repository = require('repositories/collaboratorRepository'),
        notify = require('notify'),
        router = require('plugins/router'),
        eventTracker = require('eventTracker')
    ;

    describe('viewModel dialog [collaborator]', function () {

        var viewModel,
        ownerEmail = "user@user.com",
        email = "email@user.com",
        fullName = "Full Name",
        id = 'id';

        beforeEach(function () {
            spyOn(app, 'on');
            spyOn(app, 'off');
            spyOn(app, 'trigger');
            spyOn(notify, 'error');
            spyOn(notify, 'success');
            spyOn(eventTracker, 'publish');
        });

        describe('email:', function () {

            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });
                expect(viewModel.email).toBe(email);
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

        describe('canBeRemoved:', function () {
            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail, id: 'id' });
                expect(viewModel.canBeRemoved).toBeDefined();
            });

            describe('when collaborator is owner', function () {
                it('should be false', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: ownerEmail });
                    expect(viewModel.canBeRemoved).toBeFalsy();
                });
            });

            describe('when collaborator is not owner', function () {
                it('should be false', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: 'oppa@some.style' });
                    expect(viewModel.canBeRemoved).toBeTruthy();
                });
            });
        });

        describe('isRegistered:', function () {

            it('should be observable', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: true, id: 'id' });
                expect(viewModel.isRegistered).toBeObservable();
            });
        });

        describe('isAccepted:', function () {

            it('should be observable', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: true, id: 'id' });
                expect(viewModel.isAccepted).toBeObservable();
            });
        });

        describe('id', function () {

            it('should be defined', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.id).toBe('id');
            });

        });

        describe('name:', function () {

            beforeEach(function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
            });

            it('should be observable', function () {
                expect(viewModel.name).toBeObservable();
            });

            it('should be defined', function () {
                expect(viewModel.name()).toBeDefined();
            });

            it('should be equal to fullname if exists', function () {
                expect(viewModel.name()).toBe(fullName);
            });

            it('should be equal to email if fullname is null', function () {
                viewModel = ctor(ownerEmail, { fullName: null, email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.name()).toBe(email);
            });

            it('should be equal to email if fullname is undefined', function () {
                viewModel = ctor(ownerEmail, { fullName: undefined, email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.name()).toBe(email);
            });

            it('should be equal to email if fullname is empty string', function () {
                viewModel = ctor(ownerEmail, { fullName: '', email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.name()).toBe(email);
            });

            it('should be equal to email if fullname is whitespace string', function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.name()).toBe(email);
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
                it('should be \'\'', function () {
                    viewModel = ctor(ownerEmail, { fullName: '', email: ownerEmail, registered: false });
                    expect(viewModel.avatarLetter()).toBe('');
                });
            });
        });

        describe('isRemoveConfirmationShown:', function () {
            beforeEach(function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
            });

            it('shoud be observable', function () {
                expect(viewModel.isRemoveConfirmationShown).toBeObservable();
            });

            it('shoud be true by default if collaborator is deleting', function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: 'deleting' });
                expect(viewModel.isRemoveConfirmationShown()).toBeTruthy();
            });

            it('shoud be false by default if collaborator is not deleting', function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
                expect(viewModel.isRemoveConfirmationShown()).toBeFalsy();
            });

        });

        describe('isRemoveSuccessMessageShown:', function () {
            beforeEach(function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
            });

            it('shoud be observable', function () {
                expect(viewModel.isRemoveSuccessMessageShown).toBeObservable();
            });

            it('should be false', function () {
                expect(viewModel.isRemoveSuccessMessageShown()).toBeFalsy();
            });
        });

        describe('isRemoving:', function () {
            beforeEach(function () {
                viewModel = ctor(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
            });

            it('shoud be observable', function () {
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

            it('should unsubscribe from collaboratorRegistered event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRegistered + email, viewModel.collaboratorRegistered);
            });


            it('should unsubscribe from collaboration.inviteAccepted event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteAccepted + viewModel.id, viewModel.collaborationAccepted);
            });

            describe('when removing is not in progress', function () {
                it('should set isRemoveConfirmationShown to false', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });
                    viewModel.isRemoveConfirmationShown(true);
                    viewModel.isRemoving(false);

                    viewModel.deactivate();

                    expect(viewModel.isRemoveConfirmationShown()).toBeFalsy();
                });
            });

            describe('when removing is in progress', function () {
                it('should not set isRemoveConfirmationShown to false', function () {
                    viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });
                    viewModel.isRemoveConfirmationShown(true);
                    viewModel.isRemoving(true);

                    viewModel.deactivate();

                    expect(viewModel.isRemoveConfirmationShown()).toBeTruthy();
                });
            });

        });

        describe('when collaborator is not registered', function () {

            it('should subscribe for collaboratorRegistered event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

                expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRegistered + email, viewModel.collaboratorRegistered);
            });
        });

        describe('when collaborator is not accepted', function () {

            it('should subscribe for collaboration.inviteAccepted event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id', isAccepted: false });

                expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteAccepted + viewModel.id, viewModel.collaborationAccepted);
            });
        });


        describe('collaboratorRegistered:', function () {

            it('should be a function', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });

                expect(viewModel.collaboratorRegistered).toBeFunction();
            });

            it('should update name', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });
                viewModel.name('');

                viewModel.collaboratorRegistered({ fullName: 'Registered user' });

                expect(viewModel.name()).toBe('Registered user');
            });

            it('should set registered to true', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, registered: false });

                viewModel.collaboratorRegistered({ fullName: 'Registered user' });

                expect(viewModel.isRegistered()).toBe(true);
            });

            it('should unsubscribe from collaboratorRegister event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email });

                viewModel.collaboratorRegistered({ fullName: 'Registered user' });

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRegistered + email, viewModel.collaboratorRegistered);
            });

        });

        describe('collaborationAccepted:', function() {

            it('should set isAccepted to true', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, isAccepted: false });

                viewModel.collaborationAccepted();

                expect(viewModel.isAccepted()).toBeTruthy();
            });

            it('should unsubscribe from collaboration.inviteAccepted event', function () {
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, id: 'id' });

                viewModel.collaborationAccepted();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteAccepted + viewModel.id, viewModel.collaborationAccepted);
            });
        });

        describe('showRemoveConfirmation:', function () {
            it('should set isRemoveConfirmationShown to true', function () {
                viewModel.isRemoveConfirmationShown(false);
                viewModel.showRemoveConfirmation();
                expect(viewModel.isRemoveConfirmationShown()).toBeTruthy();
            });
        });

        describe('hideRemoveConfirmation:', function () {
            it('should set isRemoveConfirmationShown to false', function () {
                viewModel.isRemoveConfirmationShown(true);
                viewModel.hideRemoveConfirmation();
                expect(viewModel.isRemoveConfirmationShown()).toBeFalsy();
            });
        });

        describe('removeCollaborator:', function () {

            var removeCollaborator;
            var courseId = 'courseId';
            var collaborator;
            var errorMessage;

            beforeEach(function () {
                collaborator = { email: 'email' };
                errorMessage = 'error';
                removeCollaborator = Q.defer();
                spyOn(repository, 'remove').and.returnValue(removeCollaborator.promise);;
                router.routeData({ courseId: courseId });
                viewModel = ctor(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: id });
            });

            it('should be function', function () {
                expect(viewModel.removeCollaborator).toBeFunction();
            });

            it('should isRemoving to true', function () {
                viewModel.isRemoving(false);
                viewModel.removeCollaborator();
                expect(viewModel.isRemoving()).toBeTruthy();
            });

            it('should send event \'Remove collaborator\'', function () {
                viewModel.removeCollaborator();
                expect(eventTracker.publish).toHaveBeenCalledWith('Remove collaborator');
            });

            it('shodul trigger event about starting deleting the collaboration', function () {
                viewModel.removeCollaborator();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.started + id, id);
            });

            it('should remove collaborator', function () {
                viewModel.removeCollaborator();
                expect(repository.remove).toHaveBeenCalledWith(courseId, email);
            });

            describe('when collaborator removed successfully', function () {

                beforeEach(function () {
                    removeCollaborator.resolve(collaborator);
                });

                it('should trigger deleting complete event', function (done) {
                    viewModel.removeCollaborator().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.completed + id, collaborator);
                        done();
                    });
                });

                it('should trigger collaborator removed event', function (done) {
                    viewModel.removeCollaborator().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaborator.email);
                        done();
                    });
                });

                it('should not trigger deleting failed event', function (done) {
                    viewModel.removeCollaborator().fin(function () {
                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.failed + id, errorMessage);
                        done();
                    });
                });

                it('should set isRemoving to false', function (done) {
                    viewModel.removeCollaborator().fin(function () {
                        expect(viewModel.isRemoving()).toBeFalsy();
                        done();
                    });
                });

                it('should set isRemoveSuccessMessageShown to true', function (done) {
                    viewModel.isRemoveSuccessMessageShown(false);
                    viewModel.removeCollaborator().fin(function () {
                        expect(viewModel.isRemoveSuccessMessageShown()).toBeTruthy();
                        done();
                    });
                });

                it('should not set isRemoveConfirmationShown to false', function (done) {
                    viewModel.isRemoveConfirmationShown(true);
                    viewModel.removeCollaborator().fin(function () {
                        expect(viewModel.isRemoveConfirmationShown()).toBeTruthy();
                        done();
                    });
                });
            });

            describe('when collaborator not removed', function () {

                beforeEach(function () {
                    removeCollaborator.reject(errorMessage);
                });

                it('should trigger deleting failed event', function (done) {
                    viewModel.removeCollaborator().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.failed + id, errorMessage);
                        done();
                    });
                });

                it('should not trigger deleting complete event', function (done) {
                    viewModel.removeCollaborator().fin(function () {
                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.completed + id, collaborator);
                        done();
                    });
                });

                it('should not trigger collaborator removed event', function (done) {
                    viewModel.removeCollaborator().fin(function () {
                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaborator.email);
                        done();
                    });
                });

                it('should isRemoving to false', function (done) {
                    viewModel.removeCollaborator().fin(function () {
                        expect(viewModel.isRemoving()).toBeFalsy();
                        done();
                    });
                });

                it('should isRemoveConfirmationShown to false', function (done) {
                    viewModel.isRemoveConfirmationShown(true);
                    viewModel.removeCollaborator().fin(function () {
                        expect(viewModel.isRemoveConfirmationShown()).toBeFalsy();
                        done();
                    });
                });
            });
        });

        describe('isLocked:', function () {
            it('shoud be observable', function () {
                expect(viewModel.isLocked).toBeObservable();
            });
        });

        describe('lock:', function () {
            it('should be function', function () {
                expect(viewModel.lock).toBeFunction();
            });

            describe('when is onwer', function () {
                beforeEach(function () {
                    viewModel.isOwner = true;
                });

                it('should not change isLocked', function () {
                    viewModel.isLocked(false);
                    viewModel.lock();

                    expect(viewModel.isLocked()).toBeFalsy();
                });
            });

            describe('when is not owner', function () {
                beforeEach(function () {
                    viewModel.isOwner = false;
                });

                it('should set isLocked to true', function () {
                    viewModel.isLocked(false);
                    viewModel.lock();

                    expect(viewModel.isLocked()).toBeTruthy();
                });
            });
        });

        describe('unlock:', function () {
            it('should be function', function () {
                expect(viewModel.unlock).toBeFunction();
            });

            describe('when is onwer', function () {
                beforeEach(function () {
                    viewModel.isOwner = true;
                });

                it('should not change isLocked', function () {
                    viewModel.isLocked(true);
                    viewModel.unlock();

                    expect(viewModel.isLocked()).toBeTruthy();
                });
            });

            describe('when is not owner', function () {
                beforeEach(function () {
                    viewModel.isOwner = false;
                });

                it('should set isLocked to false', function () {
                    viewModel.isLocked(true);
                    viewModel.unlock();

                    expect(viewModel.isLocked()).toBeFalsy();
                });
            });
        });

    });
})