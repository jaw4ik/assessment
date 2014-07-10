define(['dialogs/collaboration/addCollaborator'], function (viewModel) {

    var eventTracker = require('eventTracker'),
        localizationManager = require('localization/localizationManager'),
        repository = require('repositories/collaboratorRepository'),
        app = require('durandal/app'),
        constants = require('constants'),
        router = require('plugins/router'),
        userContext = require('userContext');

    describe('dialog [addCollabrotor]', function () {

        var localizedMessage = 'message',
            email = 'email@email.com',
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

            describe('when collaborator added successfully', function () {

                describe('and when result is undefined', function () {

                    it('should not trigger app event', function (done) {
                        var collaborator = {};
                        viewModel.email(email);
                        addCollaborator.resolve(undefined);

                        viewModel.submit().fin(function () {
                            expect(app.trigger).not.toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + courseId, collaborator);
                            done();
                        });
                    });

                });

                it('should trigger app event', function (done) {
                    var collaborator = {};
                    viewModel.email(email);
                    addCollaborator.resolve(collaborator);

                    viewModel.submit().fin(function () {
                        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + courseId, collaborator);
                        done();
                    });
                });

                it('should set onShown to false', function (done) {
                    viewModel.email(email);
                    viewModel.isShown(true);
                    addCollaborator.resolve();

                    viewModel.submit().fin(function () {
                        expect(viewModel.isShown()).toBeFalsy();
                        done();
                    });
                });

                it('should set actionInProgress to false', function (done) {
                    viewModel.email(email);
                    addCollaborator.resolve();

                    viewModel.submit().fin(function () {
                        expect(viewModel.actionInProgress()).toBeFalsy();
                        done();
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
            });
        });

        describe('show:', function () {

            var getCollaborators;

            beforeEach(function () {
                userContext.identity = {
                    subscription: {
                        accessType: 0
                    }
                };

                getCollaborators = Q.defer();
                spyOn(repository, 'getCollection').and.returnValue(getCollaborators.promise);
            });

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            it('should set email is modified to false', function () {
                viewModel.email.isModified(true);
                viewModel.show();
                expect(viewModel.email.isModified()).toBeFalsy();
            });

            it('should set email to empty string', function () {
                viewModel.email('email');
                viewModel.show();
                expect(viewModel.email()).toBe('');
            });

            it('should set is editing to false', function () {
                viewModel.isEditing(true);
                viewModel.show();
                expect(viewModel.isEditing()).toBeFalsy();
            });

            it('should set is actionInProgress to false', function () {
                viewModel.actionInProgress(null);
                viewModel.show();
                expect(viewModel.actionInProgress()).toBeFalsy();
            });

            it('should set error message to empty string', function () {
                viewModel.errorMessage('message');
                viewModel.show();
                expect(viewModel.errorMessage()).toBe('');
            });

            it('should set is shown to true', function () {
                viewModel.isShown(false);
                viewModel.show();
                expect(viewModel.isShown()).toBeTruthy();
            });

            it('should get collaborators from repository', function () {
                router.routeData({ courseId: courseId });
                viewModel.show();
                expect(repository.getCollection).toHaveBeenCalledWith(courseId);
            });

            describe('when collaborators received', function() {

                describe('and user has free access type', function() {

                    beforeEach(function() {
                        userContext.identity = {
                            subscription: {
                                accessType: "0"
                            }
                        };
                    });

                    it('should set collaborationWarning to addCollaboratorFreeWarning', function (done) {
                        viewModel.show();

                        var promise = getCollaborators.promise;
                        promise.done(function () {
                            expect(localizationManager.localize).toHaveBeenCalledWith('addCollaboratorFreeWarning');
                            expect(viewModel.collaborationWarning()).toEqual(localizedMessage);
                            done();
                        });

                        getCollaborators.resolve([]);
                    });

                });

                describe('and user has starter access type', function() {
                    
                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: "1"
                            }
                        };
                    });

                    describe('and course has less then 4 collaborators', function() {
                        
                        it('should set collaborationWarning to addCollaboratorFreeWarning', function (done) {
                            viewModel.show();

                            var promise = getCollaborators.promise;
                            promise.done(function () {
                                expect(localizationManager.localize).not.toHaveBeenCalled();
                                expect(viewModel.collaborationWarning()).toEqual('');
                                done();
                            });

                            getCollaborators.resolve([]);
                        });

                    });

                    describe('and course has more then 4 collaborators', function () {

                        it('should set collaborationWarning to addCollaboratorFreeWarning', function (done) {
                            viewModel.show();

                            var promise = getCollaborators.promise;
                            promise.done(function () {
                                expect(localizationManager.localize).toHaveBeenCalledWith('addCollaboratorStarterWarning');
                                expect(viewModel.collaborationWarning()).toEqual(localizedMessage);
                                done();
                            });

                            getCollaborators.resolve([{}, {}, {}, {}, {}]);
                        });

                    });

                });

                describe('and user has plus access type', function() {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: "2"
                            }
                        };
                    });

                    it('should set collaborationWarning to empty string', function (done) {
                        viewModel.show();

                        var promise = getCollaborators.promise;
                        promise.done(function () {
                            expect(localizationManager.localize).not.toHaveBeenCalled();
                            expect(viewModel.collaborationWarning()).toEqual('');
                            done();
                        });

                        getCollaborators.resolve([]);
                    });

                });

            });

        });

        describe('hide:', function () {
            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should set is shown to false', function () {
                viewModel.isShown(true);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });
        });

        describe('openUpgradePlanUrl:', function () {

            beforeEach(function () {
                spyOn(window, 'open');
            });

            it('should be function', function () {
                expect(viewModel.openUpgradePlanUrl).toBeFunction();
            });

            it('should send event \'Upgrade now\'', function () {
                viewModel.openUpgradePlanUrl();
                expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.collaboration);
            });

            it('should open upgrade link in new window', function () {
                viewModel.openUpgradePlanUrl();
                expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
            });

        });

    });

});