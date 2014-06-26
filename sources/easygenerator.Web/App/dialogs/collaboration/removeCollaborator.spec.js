define(['dialogs/collaboration/removeCollaborator'], function (DialogCtor) {

    var eventTracker = require('eventTracker'),
        repository = require('repositories/collaboratorRepository'),
        app = require('durandal/app'),
        constants = require('constants'),
        router = require('plugins/router');


    describe('dialog [removeCollaborator]', function () {

        var removeDialog;
        var collaboratorId = 'collaboratorId';
        var avatarLetter = 'N';
        var name = 'eg user';

        beforeEach(function () {
            removeDialog = new DialogCtor(collaboratorId, avatarLetter, name);
            spyOn(eventTracker, 'publish');
            spyOn(app, 'trigger');
        });

        it('should be defined', function () {
            expect(removeDialog).toBeDefined();
        });

        describe('collaborationId:', function () {
            it('should be defined', function () {
                expect(removeDialog.collaborationId).toBeDefined();
            });

            it('should be equal to value that was passed to ctor', function () {
                expect(removeDialog.collaborationId).toBe(collaboratorId);
            });
        });

        describe('isShown:', function () {
            it('shoould be observale', function () {
                expect(removeDialog.isShown).toBeObservable();
            });

            it('shoould be false by default', function () {
                expect(removeDialog.isShown()).toBeFalsy();
            });
        });

        describe('avatarLetter:', function () {
            it('should be defined', function () {
                expect(removeDialog.avatarLetter).toBeDefined();
            });

            it('should be equal to value that was passed to ctor', function () {
                expect(removeDialog.avatarLetter).toBe(avatarLetter);
            });
        });

        describe('displayName:', function () {
            it('should be defined', function () {
                expect(removeDialog.displayName).toBeDefined();
            });

            it('should be equal to value that was passed to ctor', function () {
                expect(removeDialog.displayName).toBe(name);
            });
        });

        describe('show:', function () {
            it('should be function', function () {
                expect(removeDialog.show).toBeFunction();
            });

            it('should set isShown to true', function () {
                removeDialog.isShown(false);
                removeDialog.show();
                expect(removeDialog.isShown()).toBeTruthy();
            });
        });

        describe('hide:', function () {
            it('should be function', function () {
                expect(removeDialog.hide).toBeFunction();
            });

            it('should set isShown to false', function () {
                removeDialog.isShown(true);
                removeDialog.hide();
                expect(removeDialog.isShown()).toBeFalsy();
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
            });

            it('should be function', function () {
                expect(removeDialog.removeCollaborator).toBeFunction();
            });

            it('should call hide method', function () {
                spyOn(removeDialog, 'hide');
                removeDialog.removeCollaborator();
                expect(removeDialog.hide).toHaveBeenCalled();
            });

            it('should call hide method', function () {
                spyOn(removeDialog, 'hide');
                removeDialog.removeCollaborator();
                expect(removeDialog.hide).toHaveBeenCalled();
            });

            it('should send event \'Remove collaborator\'', function () {
                removeDialog.removeCollaborator();
                expect(eventTracker.publish).toHaveBeenCalledWith('Remove collaborator');
            });

            it('shodul trigger event about starting deleting the collaboration', function () {
                removeDialog.removeCollaborator();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.started + collaboratorId, collaboratorId);
            });

            it('should remove collaborator', function () {
                removeDialog.removeCollaborator();
                expect(repository.remove).toHaveBeenCalledWith(courseId, collaboratorId);
            });

            describe('when collaborator removed successfully', function () {
                
                beforeEach(function () {
                    removeCollaborator.resolve(collaborator);
                });

                it('should trigger deleting complete event', function (done) {
                    removeDialog.removeCollaborator().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.completed + collaboratorId, collaborator);
                        done();
                    });
                });

                it('should trigger collaborator removed event', function (done) {
                    removeDialog.removeCollaborator().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaborator.email);
                        done();
                    });
                });

                it('should not trigger deleting failed event', function (done) {
                    removeDialog.removeCollaborator().fin(function () {
                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.failed + collaboratorId, errorMessage);
                        done();
                    });
                });
            });

            describe('when collaborator not removed', function () {
                
                beforeEach(function () {
                    removeCollaborator.reject(errorMessage);
                });

                it('should trigger deleting failed event', function (done) {
                    removeDialog.removeCollaborator().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.failed + collaboratorId, errorMessage);
                        done();
                    });
                });

                it('should not trigger deleting complete event', function (done) {
                    removeDialog.removeCollaborator().fin(function () {
                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.deleting.completed + collaboratorId, collaborator);
                        done();
                    });
                });

                it('should not trigger collaborator removed event', function (done) {
                    removeDialog.removeCollaborator().fin(function () {
                        expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaborator.email);
                        done();
                    });
                });
            });
        });
    });
});