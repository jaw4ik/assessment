import viewModel from './addCollaborator';

import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import repository from 'repositories/collaboratorRepository';
import app from 'durandal/app';
import constants from 'constants';
import router from 'routing/router';
import userContext from 'userContext';

describe('dialog [addCollabrotor]', function () {

    var localizedMessage = 'message',
        email = 'email@email.com',
        emailWithSpacesAndCapitalCases = ' emaIL@email.com ',
        courseId = 'courseId';

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(app, 'trigger');
        spyOn(localizationManager, 'localize').and.returnValue(localizedMessage);
    });

    it('should be defined', function () {
        expect(viewModel).toBeDefined();
    });

    describe('hasError:', function () {
        it('should be observable', function () {
            expect(viewModel.hasError).toBeComputed();
        });

        describe('when errorMessage is empty', function () {
            it('should be false', function () {
                viewModel.errorMessage('');
                expect(viewModel.hasError()).toBeFalsy();
            });
        });

        describe('when errorMessage is not empty', function () {
            it('should be true', function () {
                viewModel.errorMessage('error');
                expect(viewModel.hasError()).toBeTruthy();
            });
        });
    });

    describe('errorMessage:', function () {
        it('should be observable', function () {
            expect(viewModel.errorMessage).toBeObservable();
        });
    });

    describe('isEditing:', function () {
        it('should be observable', function () {
            expect(viewModel.isEditing).toBeObservable();
        });
    });

    describe('actionInProgress', function () {

        it('should be observable', function () {
            expect(viewModel.actionInProgress).toBeObservable();
        });

    });

    describe('email:', function () {
        it('should be observable', function () {
            expect(viewModel.email).toBeObservable();
        });

        describe('isValid:', function () {
            it('should be computed', function () {
                expect(viewModel.email.isValid).toBeComputed();
            });

            describe('when email value is not a valid email', function () {
                it('should be false', function () {
                    viewModel.email('email');
                    expect(viewModel.email.isValid()).toBeFalsy();
                });
            });

            describe('when email value is a valid email', function () {
                it('should be true', function () {
                    viewModel.email('test@email.com');
                    expect(viewModel.email.isValid()).toBeTruthy();
                });
            });
        });

        describe('isEmpty:', function () {
            it('should be computed', function () {
                expect(viewModel.email.isEmpty).toBeComputed();
            });

            describe('when email value is not empty', function () {
                it('should be false', function () {
                    viewModel.email('email');
                    expect(viewModel.email.isEmpty()).toBeFalsy();
                });
            });

            describe('when email value is empty', function () {
                it('should be true', function () {
                    viewModel.email('');
                    expect(viewModel.email.isEmpty()).toBeTruthy();
                });
            });
        });

        describe('isModified:', function () {
            it('should be observable', function () {
                expect(viewModel.email.isModified).toBeObservable();
            });
        });

        describe('markAsModified:', function () {
            it('should set isModified to true', function () {
                viewModel.email.isModified(false);
                viewModel.email.markAsModified();
                expect(viewModel.email.isModified()).toBeTruthy();
            });
        });
    });

    describe('submit:', function () {

        var addCollaborator;

        beforeEach(function () {
            addCollaborator = Q.defer();
            spyOn(repository, 'add').and.returnValue(addCollaborator.promise);;
            router.routeData({ courseId: courseId });
        });

        it('should be function', function () {
            expect(viewModel.submit).toBeFunction();
        });

        describe('when email is empty', function () {
            beforeEach(function () {
                viewModel.email('');
                viewModel.errorMessage('');
            });

            it('should not add collaborator', function () {
                viewModel.submit();
                expect(repository.add).not.toHaveBeenCalled();
            });

            it('should set error message', function () {
                viewModel.submit();
                expect(viewModel.errorMessage()).toBe(localizedMessage);
            });
        });

        describe('when email not valid', function () {
            beforeEach(function () {
                viewModel.email('abc');
                viewModel.errorMessage('');
            });

            it('should not add collaborator', function () {
                viewModel.submit();
                expect(repository.add).not.toHaveBeenCalled();
            });

            it('should set error message', function () {
                viewModel.submit();
                expect(viewModel.errorMessage()).toBe(localizedMessage);
            });
        });

        it('should set actionInProgress to true', function () {
            viewModel.email(email);
            viewModel.submit();
            expect(viewModel.actionInProgress()).toBeTruthy();
        });

        it('should send event \'Add person for collaboration\'', function () {
            viewModel.email(email);
            viewModel.submit();
            expect(eventTracker.publish).toHaveBeenCalledWith('Add person for collaboration');
        });

        it('should add collaborator', function () {
            viewModel.email(email);
            viewModel.submit();
            expect(repository.add).toHaveBeenCalledWith(courseId, email);
        });

        it('should trim and change case to lower of collaborator email', function () {
            viewModel.email(emailWithSpacesAndCapitalCases);
            viewModel.submit();
            expect(repository.add).toHaveBeenCalledWith(courseId, email);
        });

        describe('when collaborator added successfully', function () {

            beforeEach(function() {
                viewModel.email(email);
            });

            describe('and when result is undefined', function () {

                it('should not trigger app event', function (done) {
                    var collaborator = {};
                    addCollaborator.resolve();

                    viewModel.submit().fin(function () {
                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + courseId, collaborator);
                        done();
                    });
                });

                it('should set error message', function (done) {
                    viewModel.email(email);
                    viewModel.errorMessage('');
                    addCollaborator.resolve();

                    viewModel.submit().fin(function () {
                        expect(viewModel.errorMessage()).toBe(localizedMessage);
                        done();
                    });
                });

                it('should set actionInProgress to false', function (done) {
                    viewModel.actionInProgress(true);
                    addCollaborator.resolve();
                    viewModel.submit().fin(function () {
                        expect(viewModel.actionInProgress()).toBeFalsy();
                        done();
                    });
                });

            });

            describe('and when result is an object', function() {
                var collaborator = {};

                it('should trigger app event', function (done) {
                    addCollaborator.resolve(collaborator);

                    viewModel.submit().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + courseId, collaborator);
                        done();
                    });
                });

                it('should set actionInProgress to false', function (done) {
                    viewModel.actionInProgress(true);
                    addCollaborator.resolve(collaborator);
                    viewModel.submit().fin(function () {
                        expect(viewModel.actionInProgress()).toBeFalsy();
                        done();
                    });
                });

                it('should set email isModified to false', function (done) {
                    viewModel.email.isModified(true);
                    addCollaborator.resolve(collaborator);

                    viewModel.submit().fin(function () {
                        expect(viewModel.email.isModified()).toBeFalsy();
                        done();
                    });
                });

                it('should set email to empty string', function (done) {
                    addCollaborator.resolve(collaborator);
                    viewModel.submit().fin(function () {
                        expect(viewModel.email()).toBe('');
                        done();
                    });
                });

                it('should set isEditing to true', function (done) {
                    viewModel.isEditing(false);
                    addCollaborator.resolve(collaborator);

                    viewModel.submit().fin(function () {
                        expect(viewModel.isEditing()).toBeTruthy();
                        done();
                    });
                });

            });
        });

        describe('when failed to add collaborator', function () {

            it('should set error message', function (done) {
                viewModel.email(email);
                viewModel.errorMessage('');
                var errorMessage = 'error';
                addCollaborator.reject(errorMessage);

                viewModel.submit().fin(function () {
                    expect(viewModel.errorMessage()).toBe(errorMessage);
                    done();
                });
            });

            it('should set actionInProgress to false', function (done) {
                viewModel.email(email);
                viewModel.errorMessage('');
                var errorMessage = 'error';
                addCollaborator.reject(errorMessage);

                viewModel.submit().fin(function () {
                    expect(viewModel.actionInProgress()).toBeFalsy();
                    done();
                });
            });

            it('should set isEditing to true', function (done) {
                viewModel.isEditing(false);
                addCollaborator.reject();

                viewModel.submit().fin(function () {
                    expect(viewModel.isEditing()).toBeTruthy();
                    done();
                });
            });
        });
    });

    describe('reset:', function () {

        var getCollaborators;

        beforeEach(function () {
            userContext.identity = {
                subscription: {
                    accessType: constants.accessType.free
                }
            };

            getCollaborators = Q.defer();
            spyOn(repository, 'getCollection').and.returnValue(getCollaborators.promise);
        });

        it('should be function', function () {
            expect(viewModel.reset).toBeFunction();
        });

        it('should set email is modified to false', function () {
            viewModel.email.isModified(true);
            viewModel.reset();
            expect(viewModel.email.isModified()).toBeFalsy();
        });

        it('should set email to empty string', function () {
            viewModel.email('email');
            viewModel.reset();
            expect(viewModel.email()).toBe('');
        });

        it('should set is editing to false', function () {
            viewModel.isEditing(true);
            viewModel.reset();
            expect(viewModel.isEditing()).toBeFalsy();
        });

        it('should set is actionInProgress to false', function () {
            viewModel.actionInProgress(null);
            viewModel.reset();
            expect(viewModel.actionInProgress()).toBeFalsy();
        });

        it('should set error message to empty string', function () {
            viewModel.errorMessage('message');
            viewModel.reset();
            expect(viewModel.errorMessage()).toBe('');
        });

    });
});
