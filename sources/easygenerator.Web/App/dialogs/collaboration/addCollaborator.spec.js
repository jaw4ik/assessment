define(['dialogs/collaboration/addCollaborator'], function (Dialog) {

    var eventTracker = require('eventTracker'),
        appDialog = require('plugins/dialog'),
        localizationManager = require('localization/localizationManager'),
        repository = require('repositories/collaboratorRepository'),
        app = require('durandal/app'),
        constants = require('constants'),
        router = require('plugins/router');

    describe('dialog [addCollabrotor]', function () {

        var dialog,
            localizedMessage = 'message',
            email = 'email@email.com',
            courseId = 'courseId';

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(appDialog, 'close');
            spyOn(app, 'trigger');
            spyOn(localizationManager, 'localize').and.returnValue(localizedMessage);
            dialog = new Dialog();
        });

        it('should be function', function () {
            expect(Dialog).toBeFunction();
        });

        describe('hasError:', function () {
            it('should be observable', function () {
                expect(dialog.hasError).toBeComputed();
            });

            describe('when errorMessage is empty', function () {
                it('should be false', function () {
                    dialog.errorMessage('');
                    expect(dialog.hasError()).toBeFalsy();
                });
            });

            describe('when errorMessage is not empty', function () {
                it('should be true', function () {
                    dialog.errorMessage('error');
                    expect(dialog.hasError()).toBeTruthy();
                });
            });
        });

        describe('errorMessage:', function () {
            it('should be observable', function () {
                expect(dialog.errorMessage).toBeObservable();
            });
        });

        describe('isEditing:', function () {
            it('should be observable', function () {
                expect(dialog.isEditing).toBeObservable();
            });
        });

        describe('email:', function () {
            it('should be observable', function () {
                expect(dialog.email).toBeObservable();
            });

            describe('isValid:', function () {
                it('should be computed', function () {
                    expect(dialog.email.isValid).toBeComputed();
                });

                describe('when email value is not a valid email', function () {
                    it('should be false', function () {
                        dialog.email('email');
                        expect(dialog.email.isValid()).toBeFalsy();
                    });
                });

                describe('when email value is a valid email', function () {
                    it('should be true', function () {
                        dialog.email('test@email.com');
                        expect(dialog.email.isValid()).toBeTruthy();
                    });
                });
            });

            describe('isEmpty:', function () {
                it('should be computed', function () {
                    expect(dialog.email.isEmpty).toBeComputed();
                });

                describe('when email value is not empty', function () {
                    it('should be false', function () {
                        dialog.email('email');
                        expect(dialog.email.isEmpty()).toBeFalsy();
                    });
                });

                describe('when email value is empty', function () {
                    it('should be true', function () {
                        dialog.email('');
                        expect(dialog.email.isEmpty()).toBeTruthy();
                    });
                });
            });

            describe('isModified:', function () {
                it('should be observable', function () {
                    expect(dialog.email.isModified).toBeObservable();
                });
            });

            describe('markAsModified:', function () {
                it('should set isModified to true', function () {
                    dialog.email.isModified(false);
                    dialog.email.markAsModified();
                    expect(dialog.email.isModified()).toBeTruthy();
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
                expect(dialog.submit).toBeFunction();
            });

            it('should send event \'Add person for collaboration\'', function () {
                dialog.submit();
                expect(eventTracker.publish).toHaveBeenCalledWith('Add person for collaboration');
            });

            describe('when email is empty', function () {
                beforeEach(function () {
                    dialog.email('');
                    dialog.errorMessage('');
                });

                it('should not add collaborator', function () {
                    dialog.submit();
                    expect(repository.add).not.toHaveBeenCalled();
                });

                it('should set error message', function () {
                    dialog.submit();
                    expect(dialog.errorMessage()).toBe(localizedMessage);
                });
            });

            describe('when email not valid', function () {
                beforeEach(function () {
                    dialog.email('abc');
                    dialog.errorMessage('');
                });

                it('should not add collaborator', function () {
                    dialog.submit();
                    expect(repository.add).not.toHaveBeenCalled();
                });

                it('should set error message', function () {
                    dialog.submit();
                    expect(dialog.errorMessage()).toBe(localizedMessage);
                });
            });

            it('should add collaborator', function () {
                dialog.email(email);
                dialog.submit();
                expect(repository.add).toHaveBeenCalledWith(courseId, email);
            });

            describe('and when collaborator added successfully', function () {
                describe('when result is undefined', function() {
                    it('should not trigger app event', function (done) {
                        var collaborator = {};
                        dialog.email(email);
                        addCollaborator.resolve(undefined);

                        dialog.submit().fin(function () {
                            expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded, courseId, collaborator);
                            done();
                        });
                    });
                });

                it('should trigger app event', function (done) {
                    var collaborator = {};
                    dialog.email(email);
                    addCollaborator.resolve(collaborator);

                    dialog.submit().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded, courseId, collaborator);
                        done();
                    });
                });

                it('should close dialog window', function (done) {
                    dialog.email(email);
                    addCollaborator.resolve();

                    dialog.submit().fin(function () {
                        expect(appDialog.close).toHaveBeenCalledWith(dialog);
                        done();
                    });
                });
            });

            describe('and when failed to add collaborator', function () {
                it('should set error message', function (done) {
                    dialog.email(email);
                    dialog.errorMessage('');
                    var errorMessage = 'error';
                    addCollaborator.reject(errorMessage);

                    dialog.submit().fin(function () {
                        expect(dialog.errorMessage()).toBe(errorMessage);
                        done();
                    });
                });
            });
        });

    });

});