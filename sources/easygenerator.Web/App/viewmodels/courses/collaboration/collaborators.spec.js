define(['viewmodels/courses/collaboration/collaborators'], function (viewModel) {
    "use strict";

    var
        userContext = require('userContext'),
        eventTracker = require('eventTracker'),
        addCollaboratorDialog = require('dialogs/collaboration/collaboration'),
        collaboratorRepository = require('repositories/collaboratorRepository'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('viewModel [collaborators]', function () {

        var courseOwner = "user@user.com",
            courseId = "courseId",

            collaborators = [
                {
                    email: "contoso@ua.com",
                    fullName: "Anna Karenina",
                    createdOn: new Date(2013, 12, 31)
                },
                {
                    email: courseOwner,
                    fullName: "Super Admin",
                    createdOn: new Date(2012, 12, 31)
                },
                {
                    email: "din@ua.com",
                    fullName: "Din Don",
                    createdOn: new Date(2014, 12, 31)
                }
            ];

        beforeEach(function() {
            userContext.identity = {
                subscription: {
                    accessType: 0
                }
            };
        });

        it('should be an object', function () {
            expect(viewModel).toBeObject();
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

        describe('members:', function () {

            it('should be observavleArray', function () {
                expect(viewModel.members).toBeObservableArray();
            });

        });

        describe('canAddMember:', function () {

            it('should be observable', function () {
                expect(viewModel.canAddMember).toBeObservable();
            });

        });

        describe('addMemberDialog:', function () {

            it('should be defined', function () {
                expect(viewModel.addMemberDialog).toBeDefined();
            });

        });

        describe('addMember:', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(addCollaboratorDialog, 'show');
            });

            it('should be function', function () {
                expect(viewModel.addMember).toBeFunction();
            });

            it('should send event \'Open "add people for collaboration" dialog\'', function () {
                viewModel.addMember();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open "add people for collaboration" dialog');
            });

            it('should show dialog', function () {
                viewModel.courseOwner = courseOwner;
                viewModel.addMember();
                expect(addCollaboratorDialog.show).toHaveBeenCalledWith(courseOwner);
            });
        });

        describe('collaboratorAdded:', function () {

            var collaborator = { fullName: 'fullName', email: 'email', createdOn: new Date(2010, 12, 31) };

            it('should be function', function () {
                expect(viewModel.collaboratorAdded).toBeFunction();
            });

            it('should add collaborator', function () {
                viewModel.collaboratorAdded(collaborator);
                expect(viewModel.members().length).toBe(1);
            });

            it('should order members by created on date', function () {
                viewModel.members(collaborators);
                viewModel.collaboratorAdded(collaborator);

                expect(viewModel.members()[0].email).toBe(collaborators[2].email);
                expect(viewModel.members()[1].email).toBe(collaborators[0].email);
                expect(viewModel.members()[2].email).toBe(collaborators[1].email);
                expect(viewModel.members()[3].email).toBe(collaborator.email);
            });
        });

        describe('collaboratorRemoved:', function () {
            it('should be function', function () {
                expect(viewModel.collaboratorRemoved).toBeFunction();
            });

            it('should remove collaborator', function () {
                viewModel.members(collaborators);
                viewModel.collaboratorRemoved(collaborators[0].email);
                expect(viewModel.members().length).toBe(3);
            });
        });

        describe('activate:', function () {
            var getCollaborators;

            beforeEach(function () {
                userContext.identity = {};

                getCollaborators = Q.defer();
                spyOn(collaboratorRepository, 'getCollection').and.returnValue(getCollaborators.promise);
                spyOn(app, 'on');
            });

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when activateData is not an object', function () {
                it('should throw exception', function () {
                    var f = function () {
                        viewModel.activate();
                    };

                    expect(f).toThrow('activationData is not an object');
                });
            });

            describe('when courseId is not a string', function () {
                it('should throw exception', function () {
                    var f = function () {
                        viewModel.activate({});
                    };

                    expect(f).toThrow('courseId is not a string');
                });
            });

            describe('when courseOwner is not a string', function () {
                it('should throw exception', function () {
                    var f = function () {
                        viewModel.activate({ courseId: courseId });
                    };

                    expect(f).toThrow('courseOwner is not a string');
                });
            });

            it('should set courseId', function () {
                viewModel.activate({ courseId: courseId, courseOwner: courseOwner });

                expect(viewModel.courseId).toBe(courseId);
            });

            it('should set courseOwner', function () {
                viewModel.activate({ courseId: courseId, courseOwner: courseOwner });

                expect(viewModel.courseOwner).toBe(courseOwner);
            });

            it('should set canAddMember to false', function () {
                viewModel.activate({ courseId: courseId, courseOwner: courseOwner });

                expect(viewModel.canAddMember()).toBeFalsy();
            });

            it('should set isCollaborationDisabled to false', function () {
                viewModel.isCollaborationDisabled(true);

                viewModel.activate({ courseId: courseId, courseOwner: courseOwner });

                expect(viewModel.isCollaborationDisabled()).toBeFalsy();
            });

            describe('when user is courseOwner', function () {

                beforeEach(function () {
                    userContext.identity = { email: courseOwner };
                });

                it('should set canAddMember to true', function () {
                    viewModel.activate({ courseId: courseId, courseOwner: courseOwner });

                    expect(viewModel.canAddMember()).toBeTruthy();
                });
            });

            it('should get collaborators', function () {
                viewModel.activate({ courseId: courseId, courseOwner: courseOwner });

                expect(collaboratorRepository.getCollection).toHaveBeenCalled();
            });

            describe('when collaborators collection is retrived', function () {

                it('should be set members', function (done) {
                    var promise = getCollaborators.promise.finally(function () { });
                    getCollaborators.resolve(collaborators);

                    viewModel.activate({ courseId: courseId, courseOwner: courseOwner });

                    promise.fin(function () {
                        expect(viewModel.members().length).toBe(collaborators.length);

                        done();
                    });
                });

                it('should order members by created on date', function () {
                    var promise = getCollaborators.promise.finally(function () { });
                    getCollaborators.resolve(collaborators);

                    viewModel.activate({ courseId: courseId, courseOwner: courseOwner });


                    promise.fin(function () {
                        expect(viewModel.members()[0].email).toBe(collaborators[2].email);
                        expect(viewModel.members()[1].email).toBe(collaborators[0].email);
                        expect(viewModel.members()[2].email).toBe(collaborators[1].email);

                        done();
                    });

                });

            });

        });

        describe('deactivate', function () {
            beforeEach(function () {
                spyOn(app, 'off');
            });

            it('should be a function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should unsubscribe from collaboratorAdded event', function () {
                viewModel.members([]);

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + viewModel.courseId, viewModel.collaboratorAdded);
            });

            it('should unsubscribe from collaboratorRemoved event', function () {
                viewModel.members([]);

                viewModel.deactivate();

                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + viewModel.courseId, viewModel.collaboratorRemoved);
            });

            it('should call deactivate function for all members', function () {
                var member1 = { deactivate: function () { } },
                    member2 = { deactivate: function () { } };
                spyOn(member1, 'deactivate');
                spyOn(member2, 'deactivate');
                viewModel.members([member1, member2]);

                viewModel.deactivate();

                expect(member1.deactivate).toHaveBeenCalled();
                expect(member2.deactivate).toHaveBeenCalled();
            });

        });

    });
})