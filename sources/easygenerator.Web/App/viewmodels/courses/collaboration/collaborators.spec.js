define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/courses/collaboration/collaborators'),
        dialog = require('plugins/dialog'),
        userContext = require('userContext'),
        eventTracker = require('eventTracker')
    ;

    describe('viewModel [collaborators]', function () {

        var viewModel,
        owner = "user@user.com",
        courseId = "courseId";

        var collaborators = [
        {
            id: "0",
            email: "contoso@ua.com",
            fullName: "Anna Karenina",
            createdOn: new Date(2013, 12, 31)
        },
        {
            id: "1",
            email: "owner",
            fullName: "Super Admin",
            createdOn: new Date(2012, 12, 31)
        },
        {
            id: "2",
            email: "din@ua.com",
            fullName: "Din Don",
            createdOn: new Date(2014, 12, 31)
        }
            ];

        beforeEach(function () {
            spyOn(dialog, 'show');
            spyOn(eventTracker, 'publish');
        });

        describe('members:', function () {
            beforeEach(function () {
                userContext.identity = {};
            });

            it('should be defined', function () {
                viewModel = ctor(courseId, owner, []);
                expect(viewModel.members).toBeDefined();
            });

            it('should be set members', function () {
                viewModel = ctor(courseId, owner, collaborators);
                expect(viewModel.members().length).toBe(3);
            });

            it('should order members by created on date', function () {
                viewModel = ctor(courseId, owner, collaborators);

                expect(viewModel.members()[0].id).toBe(collaborators[2].id);
                expect(viewModel.members()[1].id).toBe(collaborators[0].id);
                expect(viewModel.members()[2].id).toBe(collaborators[1].id);
            });
        });

        describe('addMember:', function () {
            beforeEach(function () {
                userContext.identity = {};
            });

            it('should be function', function () {
                viewModel = ctor(courseId, '', []);
                expect(viewModel.addMember).toBeFunction();
            });

            it('should send event \'Open "add people for collaboration" dialog\'', function () {
                viewModel = ctor(courseId, owner, []);
                viewModel.addMember();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open "add people for collaboration" dialog');
            });

            it('should show dialog', function () {
                viewModel = ctor(courseId, owner, []);
                viewModel.addMember();
                expect(dialog.show).toHaveBeenCalled();
            });
        });

        describe('canAddMember:', function () {
            it('should be defined', function () {
                expect(viewModel.canAddMember).toBeDefined();
            });

            describe('when user is course owner', function () {
                it('should be true', function () {
                    userContext.identity = { email: owner };
                    viewModel = ctor(courseId, owner, []);
                    expect(viewModel.canAddMember).toBeTruthy();
                });
            });

            describe('when user is not course owner', function () {
                it('should be false', function () {
                    userContext.identity = { email: 'email@mail.com' };
                    viewModel = ctor(courseId, owner, []);
                    expect(viewModel.canAddMember).toBeFalsy();
                });
            });
        });

        describe('collaboratorAdded:', function () {
            beforeEach(function () {
                userContext.identity = {};
            });

            var collaborator = { fullName: 'fullName', email: 'email', createdOn: new Date(2010, 12, 31), id: "333" };

            it('should be function', function () {
                viewModel = ctor(courseId, '', []);
                expect(viewModel.collaboratorAdded).toBeFunction();
            });

            describe('when collaborated course is current course', function () {
                it('should add collaborator', function () {
                    viewModel = ctor(courseId, owner, []);
                    viewModel.collaboratorAdded(courseId, collaborator);
                    expect(viewModel.members().length).toBe(1);
                });

                it('should order members by created on date', function () {
                    viewModel = ctor(courseId, owner, collaborators);
                    viewModel.collaboratorAdded(courseId, collaborator);

                    expect(viewModel.members()[0].id).toBe(collaborators[2].id);
                    expect(viewModel.members()[1].id).toBe(collaborators[0].id);
                    expect(viewModel.members()[2].id).toBe(collaborators[1].id);
                    expect(viewModel.members()[3].id).toBe(collaborator.id);
                });
            });

            describe('when collaborated course is not current course', function () {
                it('should not add collaborator', function () {
                    viewModel = ctor(courseId, owner, []);
                    viewModel.collaboratorAdded('id', collaborator);
                    expect(viewModel.members().length).toBe(0);
                });
            });
        });
    });
})