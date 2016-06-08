import Collaborator from './collaborator';

import app from 'durandal/app';
import constants from 'constants';
import repository from 'repositories/collaboratorRepository';
import notify from 'notify';
import router from 'routing/router';
import eventTracker from 'eventTracker';
import userContext from 'userContext';

describe('viewModel dialog [collaborator]', () => {

    var viewModel,
    ownerEmail = "user@user.com",
    email = "email@user.com",
    fullName = "Full Name",
    id = 'id';

    beforeEach(() => {
        spyOn(app, 'on');
        spyOn(app, 'off');
        spyOn(app, 'trigger');
        spyOn(notify, 'error');
        spyOn(notify, 'success');
        spyOn(eventTracker, 'publish');
    });

    describe('email:', () => {

        it('should be defined', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, id: 'id' });
            expect(viewModel.email).toBe(email);
        });

    });

    describe('isOwner:', () => {
        it('should be defined', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail, id: 'id' });
            expect(viewModel.isOwner).toBeDefined();
        });

        describe('when collaborator is owner', () => {
            it('should be true', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.isOwner).toBeTruthy();
            });
        });

        describe('when collaborator is not owner', () => {
            it('should be false', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: 'oppa@some.style' });
                expect(viewModel.isOwner).toBeFalsy();
            });
        });
    });

    describe('isCurrentUser:', () => {
        it('should be defined', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail, id: 'id' });
            expect(viewModel.isCurrentUser).toBeDefined();
        });

        describe('when collaborator is current user', () => {
            beforeEach(() => {
                userContext.identity.email = ownerEmail;
            });

            it('should be true', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.isCurrentUser).toBeTruthy();
            });
        });

        describe('when collaborator is not current user', () => {
            beforeEach(() => {
                userContext.identity.email = 'anonymous';
            });

            it('should be false', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.isCurrentUser).toBeFalsy();
            });
        });
    });

    describe('canBeRemoved:', () => {
        it('should be defined', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail, id: 'id' });
            expect(viewModel.canBeRemoved).toBeDefined();
        });

        describe('when current user is course owner', () => {
            beforeEach(() => {
                userContext.identity.email = ownerEmail;
            });

            describe('when collaborator is owner', () => {
                it('should be false', () => {
                    viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail });
                    expect(viewModel.canBeRemoved).toBeFalsy();
                });
            });

            describe('when collaborator is not owner', () => {
                it('should be false', () => {
                    viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: 'oppa@some.style' });
                    expect(viewModel.canBeRemoved).toBeTruthy();
                });
            });
        });

        describe('when current user is not course owner', () => {
            beforeEach(() => {
                userContext.identity.email = 'anonymous';
            });

            it('should be false', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail });
                expect(viewModel.canBeRemoved).toBeFalsy();
            });
        });
    });

    describe('isRegistered:', () => {

        it('should be observable', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, registered: true, id: 'id' });
            expect(viewModel.isRegistered).toBeObservable();
        });
    });

    describe('isAccepted:', () => {

        it('should be observable', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, registered: true, id: 'id' });
            expect(viewModel.isAccepted).toBeObservable();
        });
    });

    describe('id', () => {

        it('should be defined', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
            expect(viewModel.id).toBe('id');
        });

    });

    describe('name:', () => {

        beforeEach(() => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: 'id' });
        });

        it('should be observable', () => {
            expect(viewModel.name).toBeObservable();
        });

        it('should be defined', () => {
            expect(viewModel.name()).toBeDefined();
        });

        it('should be equal to fullname if exists', () => {
            expect(viewModel.name()).toBe(fullName);
        });

        it('should be equal to email if fullname is null', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: null, email: email, createdOn: new Date(), state: '', id: 'id' });
            expect(viewModel.name()).toBe(email);
        });

        it('should be equal to email if fullname is undefined', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: undefined, email: email, createdOn: new Date(), state: '', id: 'id' });
            expect(viewModel.name()).toBe(email);
        });

        it('should be equal to email if fullname is empty string', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: '', email: email, createdOn: new Date(), state: '', id: 'id' });
            expect(viewModel.name()).toBe(email);
        });

        it('should be equal to email if fullname is whitespace string', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
            expect(viewModel.name()).toBe(email);
        });
    });

    describe('avatarLetter:', () => {

        it('should be computed', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail, id: 'id' });
            expect(viewModel.avatarLetter).toBeComputed();
        });

        describe('when collaborator fullName is defined', () => {
            it('should be equal to first letter of collaborator fullName', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: ownerEmail, registered: true });
                expect(viewModel.avatarLetter()).toBe(fullName.charAt(0));
            });
        });

        describe('when collaborator fullName is not defined', () => {
            it('should be equal to first letter of collaborator email', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: '', email: ownerEmail, registered: true });
                expect(viewModel.avatarLetter()).toBe(ownerEmail.charAt(0));
            });
        });

        describe('when collaborator is not registered', () => {
            it('should be \'\'', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: '', email: ownerEmail, registered: false });
                expect(viewModel.avatarLetter()).toBe('');
            });
        });
    });

    describe('isRemoveConfirmationShown:', () => {
        beforeEach(() => {
            viewModel = new Collaborator(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
        });

        it('shoud be observable', () => {
            expect(viewModel.isRemoveConfirmationShown).toBeObservable();
        });

        it('shoud be true by default if collaborator is deleting', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: 'deleting' });
            expect(viewModel.isRemoveConfirmationShown()).toBeTruthy();
        });

        it('shoud be false by default if collaborator is not deleting', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
            expect(viewModel.isRemoveConfirmationShown()).toBeFalsy();
        });

    });

    describe('isRemoveSuccessMessageShown:', () => {
        beforeEach(() => {
            viewModel = new Collaborator(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
        });

        it('shoud be observable', () => {
            expect(viewModel.isRemoveSuccessMessageShown).toBeObservable();
        });

        it('should be false', () => {
            expect(viewModel.isRemoveSuccessMessageShown()).toBeFalsy();
        });
    });

    describe('isRemoving:', () => {
        beforeEach(() => {
            viewModel = new Collaborator(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
        });

        it('shoud be observable', () => {
            expect(viewModel.isRemoving).toBeObservable();
        });

        it('shoud be true by default if collaborator is deleting', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: 'deleting' });
            expect(viewModel.isRemoving()).toBeTruthy();
        });

        it('shoud be false by default if collaborator is not deleting', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: '  ', email: email, createdOn: new Date(), state: '', id: 'id' });
            expect(viewModel.isRemoving()).toBeFalsy();
        });
    });

    describe('deactivate', () => {

        it('should be a function', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, id: 'id' });
            expect(viewModel.deactivate).toBeFunction();
        });

        describe('when removing is not in progress', () => {
            it('should set isRemoveConfirmationShown to false', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, id: 'id' });
                viewModel.isRemoveConfirmationShown(true);
                viewModel.isRemoving(false);

                viewModel.deactivate();

                expect(viewModel.isRemoveConfirmationShown()).toBeFalsy();
            });
        });

        describe('when removing is in progress', () => {
            it('should not set isRemoveConfirmationShown to false', () => {
                viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, id: 'id' });
                viewModel.isRemoveConfirmationShown(true);
                viewModel.isRemoving(true);

                viewModel.deactivate();

                expect(viewModel.isRemoveConfirmationShown()).toBeTruthy();
            });
        });

    });

    describe('collaboratorRegistered:', () => {

        it('should be a function', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email });

            expect(viewModel.collaboratorRegistered).toBeFunction();
        });

        it('should update name', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email });
            viewModel.name('');

            viewModel.collaboratorRegistered({ fullName: 'Registered user' });

            expect(viewModel.name()).toBe('Registered user');
        });

        it('should set registered to true', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, registered: false });

            viewModel.collaboratorRegistered({ fullName: 'Registered user' });

            expect(viewModel.isRegistered()).toBe(true);
        });
    });

    describe('collaborationAccepted:', function() {

        it('should set isAccepted to true', () => {
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, isAccepted: false });

            viewModel.collaborationAccepted();

            expect(viewModel.isAccepted()).toBeTruthy();
        });
    });

    describe('showRemoveConfirmation:', () => {
        it('should set isRemoveConfirmationShown to true', () => {
            viewModel.isRemoveConfirmationShown(false);
            viewModel.showRemoveConfirmation();
            expect(viewModel.isRemoveConfirmationShown()).toBeTruthy();
        });
    });

    describe('hideRemoveConfirmation:', () => {
        it('should set isRemoveConfirmationShown to false', () => {
            viewModel.isRemoveConfirmationShown(true);
            viewModel.hideRemoveConfirmation();
            expect(viewModel.isRemoveConfirmationShown()).toBeFalsy();
        });
    });

    describe('removeCollaborator:', () => {

        var removeCollaborator;
        var courseId = 'courseId';
        var collaborator;
        var errorMessage;

        beforeEach(() => {
            collaborator = { email: 'email' };
            errorMessage = 'error';
            removeCollaborator = Q.defer();
            spyOn(repository, 'remove').and.returnValue(removeCollaborator.promise);;
            router.routeData({ courseId: courseId });
            viewModel = new Collaborator(ownerEmail, { fullName: fullName, email: email, createdOn: new Date(), state: '', id: id });
        });

        it('should be function', () => {
            expect(viewModel.removeCollaborator).toBeFunction();
        });

        it('should isRemoving to true', () => {
            viewModel.isRemoving(false);
            viewModel.removeCollaborator();
            expect(viewModel.isRemoving()).toBeTruthy();
        });

        it('should send event \'Remove collaborator\'', () => {
            viewModel.removeCollaborator();
            expect(eventTracker.publish).toHaveBeenCalledWith('Remove collaborator');
        });

        it('shodul trigger event about starting deleting the collaboration', () => {
            viewModel.removeCollaborator();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.started + id, id);
        });

        it('should remove collaborator', () => {
            viewModel.removeCollaborator();
            expect(repository.remove).toHaveBeenCalledWith(courseId, email);
        });

        describe('when collaborator removed successfully', () => {

            beforeEach(() => {
                removeCollaborator.resolve(collaborator);
            });

            it('should trigger deleting complete event', done => {
                viewModel.removeCollaborator().fin(() => {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.completed + id, collaborator);
                    done();
                });
            });

            it('should trigger collaborator removed event', done => {
                viewModel.removeCollaborator().fin(() => {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaborator.email);
                    done();
                });
            });

            it('should not trigger deleting failed event', done => {
                viewModel.removeCollaborator().fin(() => {
                    expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.failed + id, errorMessage);
                    done();
                });
            });

            it('should set isRemoving to false', done => {
                viewModel.removeCollaborator().fin(() => {
                    expect(viewModel.isRemoving()).toBeFalsy();
                    done();
                });
            });

            it('should set isRemoveSuccessMessageShown to true', done => {
                viewModel.isRemoveSuccessMessageShown(false);
                viewModel.removeCollaborator().fin(() => {
                    expect(viewModel.isRemoveSuccessMessageShown()).toBeTruthy();
                    done();
                });
            });

            it('should not set isRemoveConfirmationShown to false', done => {
                viewModel.isRemoveConfirmationShown(true);
                viewModel.removeCollaborator().fin(() => {
                    expect(viewModel.isRemoveConfirmationShown()).toBeTruthy();
                    done();
                });
            });
        });

        describe('when collaborator not removed', () => {

            beforeEach(() => {
                removeCollaborator.reject(errorMessage);
            });

            it('should trigger deleting failed event', done => {
                viewModel.removeCollaborator().fin(() => {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.failed + id, errorMessage);
                    done();
                });
            });

            it('should not trigger deleting complete event', done => {
                viewModel.removeCollaborator().fin(() => {
                    expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.completed + id, collaborator);
                    done();
                });
            });

            it('should not trigger collaborator removed event', done => {
                viewModel.removeCollaborator().fin(() => {
                    expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaborator.email);
                    done();
                });
            });

            it('should isRemoving to false', done => {
                viewModel.removeCollaborator().fin(() => {
                    expect(viewModel.isRemoving()).toBeFalsy();
                    done();
                });
            });

            it('should isRemoveConfirmationShown to false', done => {
                viewModel.isRemoveConfirmationShown(true);
                viewModel.removeCollaborator().fin(() => {
                    expect(viewModel.isRemoveConfirmationShown()).toBeFalsy();
                    done();
                });
            });
        });
    });
});
