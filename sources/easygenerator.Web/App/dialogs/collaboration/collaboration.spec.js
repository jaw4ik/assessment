import viewModel from './collaboration';

import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import repository from 'repositories/collaboratorRepository';
import app from 'durandal/app';
import constants from 'constants';
import router from 'plugins/router';
import userContext from 'userContext';
import addCollaboratorViewModel from 'dialogs/collaboration/addCollaborator';
import StopCollaborationViewModel from 'dialogs/collaboration/stopCollaboration';

describe('dialog [collaboration]', () => {

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
                deactivate: function () { },
                isOwner: true
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


    beforeEach(() => {
        spyOn(eventTracker, 'publish');
        spyOn(app, 'trigger');
        spyOn(localizationManager, 'localize').and.returnValue(localizedMessage);
        spyOn(addCollaboratorViewModel, 'submit');
        spyOn(addCollaboratorViewModel, 'reset');

        spyOn(app, 'on');
        spyOn(app, 'off');
    });

    it('should be defined', () => {
        expect(viewModel).toBeDefined();
    });

    describe('isShown:', () => {
        it('should be observable', () => {
            expect(viewModel.isShown).toBeObservable();
        });
    });

    describe('collaborationWarning:', () => {
        it('should be observable', () => {
            expect(viewModel.collaborationWarning).toBeObservable();
        });
    });

    describe('courseId:', () => {
        it('should be defined', () => {
            expect(viewModel.courseId).toBeDefined();
        });
    });

    describe('courseOwner:', () => {
        it('should be defined', () => {
            expect(viewModel.courseOwner).toBeDefined();
        });
    });

    describe('isUserCourseOwner:', () => {
        it('should be observable', () => {
            expect(viewModel.isUserCourseOwner).toBeObservable();
        });
    });

    describe('addCollaboratorViewModel:', () => {
        it('should be defined', () => {
            expect(viewModel.addCollaboratorViewModel).toBeDefined();
        });
    });

    describe('stopCollaborationViewModel:', () => {
        it('should be defined', () => {
            expect(viewModel.stopCollaborationViewModel).toBeDefined();
        });
    });

    describe('isLoadingCollaborators:', () => {
        it('should be observable', () => {
            expect(viewModel.isLoadingCollaborators).toBeObservable();
        });
    });

    describe('collaborators:', () => {
        it('should be observable array', () => {
            expect(viewModel.collaborators).toBeObservableArray();
        });
    });

    describe('show:', () => {

        beforeEach(() => {
            spyOn(repository, 'getCollection').and.returnValue(Promise.resolve(collaborators));
            router.routeData({ courseId: courseId });
            userContext.identity = { email: 'anonymous' };
        });

        describe('when courseId is not a string', () => {
            it('should reject promise', done => {
                viewModel.show().catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                });
            });
        });

        describe('when courseOwner is not a string', () => {
            it('should reject promise', done => {
                viewModel.show(courseId).catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                });
            });
        });

        describe('when user is course owner:', () => {
            beforeEach(() => {
                userContext.identity = { email: courseOwner };
            });

            it('should set isUserCourseOwner to true', done => (async () => {
                viewModel.isUserCourseOwner(false);
                await viewModel.show(courseId, courseOwner);;
                expect(viewModel.isUserCourseOwner()).toBeTruthy();
            })().then(done));
        });

        describe('when user is not a course owner:', () => {
            beforeEach(() => {
                userContext.identity = { email: 'anonymous' };
            });

            it('should set isUserCourseOwner to false', done => (async () => {
                viewModel.isUserCourseOwner(true);
                await viewModel.show(courseId, courseOwner);
                expect(viewModel.isUserCourseOwner()).toBeFalsy();
            })().then(done));
        });

        it('should reset addCollaboratorViewModel', done => (async () => {
            await viewModel.show(courseId, courseOwner);
            expect(addCollaboratorViewModel.reset).toHaveBeenCalled();
        })().then(done));

        it('should set courseId', done => (async () => {
            await viewModel.show(courseId, courseOwner);
            expect(viewModel.courseId).toBe(courseId);
        })().then(done));

        it('should set courseOwner', done => (async () => {
            await viewModel.show(courseId, courseOwner);
            expect(viewModel.courseOwner).toBe(courseOwner);
        })().then(done));

        it('should set is shown to true', done => (async () => {
            viewModel.isShown(false);
            await viewModel.show(courseId, courseOwner);
            expect(viewModel.isShown()).toBeTruthy();
        })().then(done));

        it('should set courseId', done => (async () => {
            viewModel.courseId = '';
            await viewModel.show(courseId, courseOwner);
            expect(viewModel.courseId).toBe(courseId);
        })().then(done));

        it('should get collaborators from repository', done => (async () => {
            await viewModel.show(courseId, courseOwner);
            expect(repository.getCollection).toHaveBeenCalledWith(courseId);
        })().then(done));

        it('should set sorted collaborators', done => (async () => {
            userContext.identity = { email: collaborators[2].email };

            await viewModel.show(courseId, courseOwner);

            expect(viewModel.collaborators()[0].email).toBe(collaborators[1].email);
            expect(viewModel.collaborators()[1].email).toBe(collaborators[2].email);
            expect(viewModel.collaborators()[2].email).toBe(collaborators[0].email);
        })().then(done));
    });

    describe('hide:', () => {
        beforeEach(() => {
            userContext.identity = {
                email: courseOwner,
                subscription: {
                    accessType: constants.accessType.free
                }
            };

            var subscription = { dispose: () => { } };
            viewModel.collaborators.subscription = subscription;
            spyOn(subscription, 'dispose');
        });

        it('should be function', () => {
            expect(viewModel.hide).toBeFunction();
        });

        it('should set is shown to false', () => {
            viewModel.isShown(true);
            viewModel.hide();
            expect(viewModel.isShown()).toBeFalsy();
        });

        it('should call deactivate function for all collaborators', () => {
            spyOn(collaborators[0], 'deactivate');
            spyOn(collaborators[1], 'deactivate');
            viewModel.collaborators([collaborators[0], collaborators[1]]);

            viewModel.hide();

            expect(collaborators[0].deactivate).toHaveBeenCalled();
            expect(collaborators[1].deactivate).toHaveBeenCalled();
        });
    });

    describe('addCollaboratorViewModel', () => {

        it('should be defined', () => {
            expect(viewModel.addCollaboratorViewModel).toBeDefined();
        });

    });

    describe('collaboratorAdded:', function () {

        var collaborator = {
            email: "asd@ua.com",
            fullName: "Anna Karenina",
            createdOn: new Date(2015, 12, 31),
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

        it('should add collaborator', function () {
            viewModel.collaborators(collaborators);
            viewModel.collaboratorAdded(collaborator);
            expect(viewModel.collaborators().length).toBe(4);
        });

        it('should sort collaborators', function () {
            collaborators[2].isCurrentUser = true;

            viewModel.collaborators(collaborators);
            viewModel.collaboratorAdded(collaborator);

            expect(viewModel.collaborators()[0].email).toBe(collaborators[1].email);
            expect(viewModel.collaborators()[1].email).toBe(collaborators[2].email);
            expect(viewModel.collaborators()[2].email).toBe(collaborators[0].email);
            expect(viewModel.collaborators()[3].email).toBe(collaborator.email);
        });
    });

    describe('collaboratorRemoved:', () => {

        beforeEach(() => {
            userContext.identity = {
                email: courseOwner,
                subscription: {
                    accessType: constants.accessType.free
                }
            };
        });

        it('should remove collaborator', () => {
            viewModel.collaborators([collaborators[0]]);
            viewModel.collaboratorRemoved(collaborators[0].email);
            expect(viewModel.collaborators().length).toBe(0);
        });
    });

});
