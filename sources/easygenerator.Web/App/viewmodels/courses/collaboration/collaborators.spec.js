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

        beforeEach(function () {
            spyOn(dialog, 'show');
            spyOn(eventTracker, 'publish');
        });

        describe('members:', function () {
            var collaborators = [
                {
                    email: "contoso@ua.com",
                    fullName: "Anna Karenina"
                },
                {
                    email: "owner",
                    fullName: "Super Admin"
                },
                {
                    email: "din@ua.com",
                    fullName: "Din Don"
                }
            ];

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

            it('should be function', function () {
                viewModel = ctor(courseId, '', []);
                expect(viewModel.collaboratorAdded).toBeFunction();
            });

            describe('when collaborated course is current course', function () {
                it('should add collaborator', function () {
                    var collaborator = { fullName: 'fullName', email: 'email' };
                    viewModel = ctor(courseId, owner, []);
                    viewModel.collaboratorAdded(courseId, collaborator);
                    expect(viewModel.members().length).toBe(1);
                });
            });

            describe('when collaborated course is not current course', function () {
                it('should not add collaborator', function () {
                    var collaborator = { fullName: 'fullName', email: 'email' };
                    viewModel = ctor(courseId, owner, []);
                    viewModel.collaboratorAdded('id', collaborator);
                    expect(viewModel.members().length).toBe(0);
                });
            });
        });
    });
})