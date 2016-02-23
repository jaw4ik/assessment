import viewModel from './collaboration';

import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import repository from 'repositories/collaboratorRepository';
import app from 'durandal/app';
import constants from 'constants';
import router from 'plugins/router';
import userContext from 'userContext';
import addCollaboratorViewModel from 'dialogs/collaboration/addCollaborator';

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

    describe('show:', function () {

        var getCollaborators;

        beforeEach(function () {
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
    });

});
