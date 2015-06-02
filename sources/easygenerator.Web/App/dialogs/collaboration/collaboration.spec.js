define(['dialogs/collaboration/collaboration'], function (viewModel) {

    var eventTracker = require('eventTracker'),
        localizationManager = require('localization/localizationManager'),
        repository = require('repositories/collaboratorRepository'),
        app = require('durandal/app'),
        constants = require('constants'),
        router = require('plugins/router'),
        userContext = require('userContext'),
        addCollaboratorViewModel = require('dialogs/collaboration/addCollaborator');

    describe('dialog [collaboration]', function () {

        var localizedMessage = 'message',
            courseId = 'courseId',
            courseOwner = 'admin',
             collaborators = [
             {
                 email: "contoso@ua.com",
                 fullName: "Anna Karenina",
                 createdOn: new Date(2013, 12, 31),
                 lock: function () { },
                 unlock: function () { },
                 deactivate: function () { }
             },
                {
                    email: courseOwner,
                    fullName: "Super Admin",
                    createdOn: new Date(2012, 12, 31),
                    lock: function () { },
                    unlock: function () { },
                    deactivate: function () { }
                },
                {
                    email: "din@ua.com",
                    fullName: "Din Don",
                    createdOn: new Date(2014, 12, 31),
                    lock: function () { },
                    unlock: function () { },
                    deactivate: function () { }
                }
             ];


        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(app, 'trigger');
            spyOn(localizationManager, 'localize').and.returnValue(localizedMessage);
            spyOn(addCollaboratorViewModel, 'submit');
            spyOn(addCollaboratorViewModel, 'reset');
            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('isShown:', function () {
            it('should be observable', function () {
                expect(viewModel.isShown).toBeObservable();
            });
        });

        describe('collaborationWarning:', function () {
            it('should be observable', function () {
                expect(viewModel.collaborationWarning).toBeObservable();
            });
        });

        describe('courseId:', function () {
            it('should be defined', function () {
                expect(viewModel.courseId).toBeDefined();
            });
        });

        describe('courseOwner:', function () {
            it('should be defined', function () {
                expect(viewModel.courseOwner).toBeDefined();
            });
        });

        describe('addCollaboratorViewModel:', function () {
            it('should be defined', function () {
                expect(viewModel.addCollaboratorViewModel).toBeDefined();
            });
        });

        describe('isLoadingCollaborators:', function () {
            it('should be observable', function () {
                expect(viewModel.isLoadingCollaborators).toBeObservable();
            });
        });

        describe('collaborators:', function () {
            it('should be observable array', function () {
                expect(viewModel.collaborators).toBeObservableArray();
            });
        });

        describe('isCollaborationLocked:', function () {
            it('should be observable', function () {
                expect(viewModel.isCollaborationLocked).toBeObservable();
            });
        });

        describe('isAddCollaboratorLocked:', function () {
            it('should be observable', function () {
                expect(viewModel.isAddCollaboratorLocked).toBeObservable();
            });
        });

        describe('isUpgradeInvitationShown:', function () {
            it('should be observable', function () {
                expect(viewModel.isUpgradeInvitationShown).toBeObservable();
            });
        });

        describe('show:', function () {

            var getCollaborators;

            beforeEach(function () {
                userContext.identity = {
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };

                getCollaborators = Q.defer();
                spyOn(repository, 'getCollection').and.returnValue(getCollaborators.promise);
                router.routeData({ courseId: courseId });
            });

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            describe('when courseId is not a string', function () {
                it('should throw exception', function () {
                    var f = function () {
                        viewModel.show();
                    };

                    expect(f).toThrow('courseId is not a string');
                });
            });

            describe('when courseOwner is not a string', function () {
                it('should throw exception', function () {
                    var f = function () {
                        viewModel.show(courseId);
                    };

                    expect(f).toThrow('courseOwner is not a string');
                });
            });

            it('should reset addCollaboratorViewModel', function () {
                viewModel.show(courseId, courseOwner);
                expect(addCollaboratorViewModel.reset).toHaveBeenCalled();
            });

            it('should set courseId', function () {
                viewModel.courseId = '';
                viewModel.show(courseId, courseOwner);
                expect(viewModel.courseId).toBe(courseId);
            });

            it('should set courseOwner', function () {
                viewModel.courseOwner = '';
                viewModel.show(courseId, courseOwner);
                expect(viewModel.courseOwner).toBe(courseOwner);
            });

            it('should set isUpgradeInvitationShown shown to false', function () {
                viewModel.isUpgradeInvitationShown(true);
                viewModel.show(courseId, courseOwner);
                expect(viewModel.isUpgradeInvitationShown()).toBeFalsy();
            });

            it('should set isAddCollaboratorLocked shown to false', function () {
                viewModel.isAddCollaboratorLocked(true);
                viewModel.show(courseId, courseOwner);
                expect(viewModel.isAddCollaboratorLocked()).toBeFalsy();
            });

            it('should set is shown to true', function () {
                viewModel.isShown(false);
                viewModel.show(courseId, courseOwner);
                expect(viewModel.isShown()).toBeTruthy();
            });

            it('should set isLoadingCollaborators to true', function () {
                viewModel.isLoadingCollaborators(false);
                viewModel.show(courseId, courseOwner);
                expect(viewModel.isLoadingCollaborators()).toBeTruthy();
            });

            it('should set courseIdt', function () {
                viewModel.courseId = '';
                viewModel.show(courseId, courseOwner);

                expect(viewModel.courseId).toBe(courseId);
            });

            it('should subscribe to collaboratorAdded event', function () {
                viewModel.courseId = courseId;
                viewModel.show(courseId, courseOwner);

                expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + courseId, viewModel.collaboratorAdded);
            });

            it('should subscribe to collaboratorRemoved event', function () {
                viewModel.courseId = courseId;
                viewModel.show(courseId, courseOwner);

                expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + courseId, viewModel.collaboratorRemoved);
            });

            it('should get collaborators from repository', function () {
                viewModel.show(courseId, courseOwner);
                expect(repository.getCollection).toHaveBeenCalledWith(courseId);
            });

            describe('when collaborators received', function () {

                it('should set collaborators', function (done) {
                    var promise = getCollaborators.promise.finally(function () { });
                    getCollaborators.resolve(collaborators);

                    viewModel.show(courseId, courseOwner);

                    promise.fin(function () {
                        expect(viewModel.collaborators().length).toBe(collaborators.length);

                        done();
                    });
                });

                describe('when user is course owner', function () {
                    beforeEach(function () {
                        viewModel.courseOwner = courseOwner;
                        userContext.identity = {
                            email: courseOwner,
                            subscription: {
                                accessType: constants.accessType.free
                            }
                        };
                    });

                    it('should call updateCollaborationStatus', function (done) {
                        var promise = getCollaborators.promise.finally(function () { });
                        spyOn(viewModel, 'updateCollaborationStatus');
                        getCollaborators.resolve(collaborators);

                        viewModel.show(courseId, courseOwner);

                        promise.fin(function () {
                            expect(viewModel.updateCollaborationStatus).toHaveBeenCalled();

                            done();
                        });
                    });
                });

                it('should order members by created on date', function () {
                    var promise = getCollaborators.promise.finally(function () { });
                    getCollaborators.resolve(collaborators);

                    viewModel.show(courseId, courseOwner);

                    promise.fin(function () {
                        expect(viewModel.collaborators()[0].email).toBe(collaborators[1].email);
                        expect(viewModel.collaborators()[1].email).toBe(collaborators[0].email);
                        expect(viewModel.collaborators()[2].email).toBe(collaborators[2].email);

                        done();
                    });

                });
            });

            describe('when user is course owner', function () {
                beforeEach(function () {
                    viewModel.courseOwner = courseOwner;
                    userContext.identity = {
                        email: courseOwner,
                        subscription: {
                            accessType: constants.accessType.free
                        }
                    };
                });

                it('should subscribe on user downgraded event', function () {
                    viewModel.show(courseId, courseOwner);

                    expect(app.on).toHaveBeenCalledWith(constants.messages.user.downgraded, viewModel.updateCollaborationStatus);
                });

                it('should subscribe from user upgradedToStarter event', function () {
                    viewModel.show(courseId, courseOwner);

                    expect(app.on).toHaveBeenCalledWith(constants.messages.user.upgradedToStarter, viewModel.updateCollaborationStatus);
                });

                it('should subscribe from user upgradedToPlus event', function () {
                    viewModel.show(courseId, courseOwner);

                    expect(app.on).toHaveBeenCalledWith(constants.messages.user.upgradedToPlus, viewModel.updateCollaborationStatus);
                });
            });

        });

        describe('hide:', function () {
            beforeEach(function () {
                userContext.identity = {
                    email: courseOwner,
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };

                var subscription = { dispose: function () { } };
                viewModel.collaborators.subscription = subscription;
                spyOn(subscription, 'dispose');
            });

            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should set is shown to false', function () {
                viewModel.isShown(true);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });

            it('should unsubscribe from collaboratorAdded event', function () {
                viewModel.courseId = courseId;
                viewModel.hide();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + viewModel.courseId, viewModel.collaboratorAdded);
            });

            it('should unsubscribe from collaboratorRemoved event', function () {
                viewModel.courseId = courseId;
                viewModel.hide();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + viewModel.courseId, viewModel.collaboratorRemoved);
            });

            it('should call deactivate function for all collaborators', function () {
                spyOn(collaborators[0], 'deactivate');
                spyOn(collaborators[1], 'deactivate');
                viewModel.collaborators([collaborators[0], collaborators[1]]);

                viewModel.hide();

                expect(collaborators[0].deactivate).toHaveBeenCalled();
                expect(collaborators[1].deactivate).toHaveBeenCalled();
            });

            describe('when user is course owner', function () {

                beforeEach(function () {
                    viewModel.courseOwner = courseOwner;
                });

                it('should unsubscribe from user downgraded event', function () {
                    viewModel.hide();

                    expect(app.off).toHaveBeenCalledWith(constants.messages.user.downgraded, viewModel.updateCollaborationStatus);
                });

                it('should unsubscribe from user upgradedToStarter event', function () {
                    viewModel.hide();

                    expect(app.off).toHaveBeenCalledWith(constants.messages.user.upgradedToStarter, viewModel.updateCollaborationStatus);
                });

                it('should unsubscribe from user upgradedToPlus event', function () {
                    viewModel.hide();

                    expect(app.off).toHaveBeenCalledWith(constants.messages.user.upgradedToPlus, viewModel.updateCollaborationStatus);
                });

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

        describe('addCollaboratorViewModel', function () {

            it('should be defined', function () {
                expect(viewModel.addCollaboratorViewModel).toBeDefined();
            });

        });

        describe('collaboratorAdded:', function () {

            var collaborator = {
                email: "asd@ua.com",
                fullName: "Anna Karenina",
                createdOn: new Date(2013, 12, 31),
                lock: function () { },
                unlock: function () { }
            };

            beforeEach(function () {
                userContext.identity = {
                    email: courseOwner,
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };
            });

            it('should be function', function () {
                expect(viewModel.collaboratorAdded).toBeFunction();
            });

            it('should add collaborator', function () {
                viewModel.collaborators(collaborators);
                viewModel.collaboratorAdded(collaborator);
                expect(viewModel.collaborators().length).toBe(4);
            });

            it('should order members by created on date', function () {
                viewModel.collaborators(collaborators);
                viewModel.collaboratorAdded(collaborator);

                expect(viewModel.collaborators()[0].email).toBe(collaborators[1].email);
                expect(viewModel.collaborators()[1].email).toBe(collaborators[0].email);
                expect(viewModel.collaborators()[2].email).toBe(collaborators[2].email);
                expect(viewModel.collaborators()[3].email).toBe(collaborator.email);
            });

            it('should update collaboration status', function () {
                spyOn(viewModel, 'updateCollaborationStatus');
                viewModel.collaborators(collaborators);
                viewModel.collaboratorAdded(collaborator);

                expect(viewModel.updateCollaborationStatus).toHaveBeenCalled();
            });
        });

        describe('collaboratorRemoved:', function () {

            beforeEach(function () {
                userContext.identity = {
                    email: courseOwner,
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };
            });

            it('should be function', function () {
                expect(viewModel.collaboratorRemoved).toBeFunction();
            });

            it('should remove collaborator', function () {
                viewModel.collaborators([collaborators[0]]);
                viewModel.collaboratorRemoved(collaborators[0].email);
                expect(viewModel.collaborators().length).toBe(0);
            });

            it('should update collaboration status', function () {
                spyOn(viewModel, 'updateCollaborationStatus');
                viewModel.collaborators(collaborators);
                viewModel.collaboratorRemoved(collaborators[0]);

                expect(viewModel.updateCollaborationStatus).toHaveBeenCalled();
            });
        });

        describe('updateCollaborationStatus:', function () {
            it('should be function', function () {
                expect(viewModel.updateCollaborationStatus).toBeFunction();
            });

            describe('when user has free access type', function () {

                beforeEach(function () {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.free
                        }
                    };
                });

                it('should set collaborationWarning to addCollaboratorFreeWarning', function () {
                    viewModel.updateCollaborationStatus();

                    expect(localizationManager.localize).toHaveBeenCalledWith('addCollaboratorFreeWarning');
                    expect(viewModel.collaborationWarning()).toEqual(localizedMessage);
                });

                it('should set isCollaborationLocked to true', function () {
                    viewModel.isCollaborationLocked(false);
                    viewModel.updateCollaborationStatus();

                    expect(viewModel.isCollaborationLocked()).toBeTruthy();
                });

                it('should set isAddCollaboratorLocked to true', function () {
                    viewModel.isAddCollaboratorLocked(false);
                    viewModel.updateCollaborationStatus();

                    expect(viewModel.isAddCollaboratorLocked()).toBeTruthy();
                });

                it('should call lock function for all collaborators', function () {
                    var member1 = { lock: function () { } },
                        member2 = { lock: function () { } };
                    spyOn(member1, 'lock');
                    spyOn(member2, 'lock');
                    viewModel.collaborators([member1, member2]);

                    viewModel.updateCollaborationStatus();

                    expect(member1.lock).toHaveBeenCalled();
                    expect(member2.lock).toHaveBeenCalled();
                });

                describe('and when collaborators count == 1', function () {
                    beforeEach(function () {
                        viewModel.collaborators([collaborators[0]]);
                    });

                    it('should set isUpgradeInvitationShown to true', function () {
                        viewModel.isUpgradeInvitationShown(false);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isUpgradeInvitationShown()).toBeTruthy();
                    });
                });

                describe('and when collaborators count > 1', function () {
                    beforeEach(function () {
                        viewModel.collaborators([collaborators[0], collaborators[1]]);
                    });

                    it('should set isUpgradeInvitationShown to false', function () {
                        viewModel.isUpgradeInvitationShown(true);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isUpgradeInvitationShown()).toBeFalsy();
                    });
                });

            });

            describe('when user has starter access type', function () {

                beforeEach(function () {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.starter
                        }
                    };
                });

                describe('and collaborators count more than max allowed', function () {

                    beforeEach(function () {
                        viewModel.collaborators([collaborators[0], collaborators[1], collaborators[2], collaborators[0], collaborators[1]]);
                    });

                    it('should set collaborationWarning to addCollaboratorStarterWarning', function () {
                        viewModel.updateCollaborationStatus();

                        expect(localizationManager.localize).toHaveBeenCalledWith('addCollaboratorStarterWarning');
                        expect(viewModel.collaborationWarning()).toEqual(localizedMessage);
                    });

                    it('should set isCollaborationLocked to true', function () {
                        viewModel.isCollaborationLocked(false);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isCollaborationLocked()).toBeTruthy();
                    });

                    it('should call lock function for all collaborators', function () {
                        spyOn(collaborators[0], 'lock');
                        spyOn(collaborators[1], 'lock');
                        spyOn(collaborators[2], 'lock');

                        viewModel.updateCollaborationStatus();

                        expect(collaborators[0].lock).toHaveBeenCalled();
                        expect(collaborators[1].lock).toHaveBeenCalled();
                        expect(collaborators[2].lock).toHaveBeenCalled();
                    });

                    it('should set isAddCollaboratorLocked to true', function () {
                        viewModel.isCollaborationLocked(false);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isAddCollaboratorLocked()).toBeTruthy();
                    });

                    it('should set isUpgradeInvitationShown to false', function () {
                        viewModel.isUpgradeInvitationShown(true);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isUpgradeInvitationShown()).toBeFalsy();
                    });
                });

                describe('and collaborators count is max allowed', function () {

                    beforeEach(function () {
                        viewModel.collaborators([collaborators[0], collaborators[1], collaborators[2], collaborators[0]]);
                    });

                    it('should set collaborationWarning to addCollaboratorStarterWarning', function () {
                        viewModel.updateCollaborationStatus();

                        expect(localizationManager.localize).toHaveBeenCalledWith('addCollaboratorStarterWarning');
                        expect(viewModel.collaborationWarning()).toEqual(localizedMessage);
                    });

                    it('should set isCollaborationLocked to false', function () {
                        viewModel.isCollaborationLocked(true);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isCollaborationLocked()).toBeFalsy();
                    });

                    it('should call unlock function for all collaborators', function () {
                        spyOn(collaborators[0], 'unlock');
                        spyOn(collaborators[1], 'unlock');
                        spyOn(collaborators[2], 'unlock');

                        viewModel.updateCollaborationStatus();

                        expect(collaborators[0].unlock).toHaveBeenCalled();
                        expect(collaborators[1].unlock).toHaveBeenCalled();
                        expect(collaborators[2].unlock).toHaveBeenCalled();
                    });

                    it('should set isAddCollaboratorLocked to true', function () {
                        viewModel.isCollaborationLocked(false);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isAddCollaboratorLocked()).toBeTruthy();
                    });

                    it('should set isUpgradeInvitationShown to false', function () {
                        viewModel.isUpgradeInvitationShown(true);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isUpgradeInvitationShown()).toBeFalsy();
                    });
                });

                describe('and collaborators count less than max allowed', function () {

                    beforeEach(function () {
                        viewModel.collaborators([collaborators[0], collaborators[1]]);
                    });

                    it('should set collaborationWarning to addCollaboratorStarterWarning', function () {
                        viewModel.updateCollaborationStatus();

                        expect(localizationManager.localize).toHaveBeenCalledWith('addCollaboratorStarterWarning');
                        expect(viewModel.collaborationWarning()).toEqual(localizedMessage);
                    });

                    it('should set isCollaborationLocked to false', function () {
                        viewModel.isCollaborationLocked(true);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isCollaborationLocked()).toBeFalsy();
                    });

                    it('should call unlock function for all collaborators', function () {
                        spyOn(collaborators[0], 'unlock');
                        spyOn(collaborators[1], 'unlock');

                        viewModel.updateCollaborationStatus();

                        expect(collaborators[0].unlock).toHaveBeenCalled();
                        expect(collaborators[1].unlock).toHaveBeenCalled();
                    });

                    it('should set isAddCollaboratorLocked to false', function () {
                        viewModel.isCollaborationLocked(true);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isAddCollaboratorLocked()).toBeFalsy();
                    });

                    it('should set isUpgradeInvitationShown to false', function () {
                        viewModel.isUpgradeInvitationShown(true);
                        viewModel.updateCollaborationStatus();

                        expect(viewModel.isUpgradeInvitationShown()).toBeFalsy();
                    });
                });
            });

            describe('when user has plus access type', function () {
                beforeEach(function () {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus
                        }
                    };
                    viewModel.collaborators([collaborators[0], collaborators[1]]);
                });

                it('should set collaborationWarning to empty string', function () {
                    viewModel.collaborationWarning('error');
                    viewModel.updateCollaborationStatus();

                    expect(viewModel.collaborationWarning()).toEqual('');
                });

                it('should set isCollaborationLocked to false', function () {
                    viewModel.isCollaborationLocked(true);
                    viewModel.updateCollaborationStatus();

                    expect(viewModel.isCollaborationLocked()).toBeFalsy();
                });

                it('should call unlock function for all collaborators', function () {
                    spyOn(collaborators[0], 'unlock');
                    spyOn(collaborators[1], 'unlock');

                    viewModel.updateCollaborationStatus();

                    expect(collaborators[0].unlock).toHaveBeenCalled();
                    expect(collaborators[1].unlock).toHaveBeenCalled();
                });

                it('should set isAddCollaboratorLocked to false', function () {
                    viewModel.isCollaborationLocked(true);
                    viewModel.updateCollaborationStatus();

                    expect(viewModel.isAddCollaboratorLocked()).toBeFalsy();
                });

                it('should set isUpgradeInvitationShown to false', function () {
                    viewModel.isUpgradeInvitationShown(true);
                    viewModel.updateCollaborationStatus();

                    expect(viewModel.isUpgradeInvitationShown()).toBeFalsy();
                });
            });
        });

    });

});