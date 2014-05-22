define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/courses/collaboration/collaborators'),
        dialog = require('plugins/dialog'),
        userContext = require('userContext'),
        eventTracker = require('eventTracker')
    ;

    describe('viewModel [collaborators]', function () {

        var viewModel;
        var owner = "user@user.com";

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
                viewModel = ctor(owner, []);
                expect(viewModel.members).toBeDefined();
            });

            it('should be set members', function () {
                viewModel = ctor(owner, collaborators);
                expect(viewModel.members().length).toBe(3);
            });
        });

        describe('addMember:', function () {
            beforeEach(function () {
                userContext.identity = {};
            });

            it('should be function', function () {
                viewModel = ctor('', []);
                expect(viewModel.addMember).toBeFunction();
            });

            it('should send event \'Open "add people for collaboration" dialog\'', function () {
                viewModel = ctor(owner, []);
                viewModel.addMember();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open "add people for collaboration" dialog');
            });

            it('should show dialog', function () {
                viewModel = ctor(owner, []);
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
                    viewModel = ctor(owner, []);
                    expect(viewModel.canAddMember).toBeTruthy();
                });
            });

            describe('when user is not course owner', function () {
                it('should be false', function () {
                    userContext.identity = { email: 'email@mail.com' };
                    viewModel = ctor(owner, []);
                    expect(viewModel.canAddMember).toBeFalsy();
                });
            });
        });

        describe('collaboratorAdded:', function () {
            beforeEach(function () {
                userContext.identity = {};
            });

            it('should be function', function () {
                viewModel = ctor('', []);
                expect(viewModel.collaboratorAdded).toBeFunction();
            });

            it('should add collaborator', function () {
                var collaborator = { fullName: 'fullName', email: 'email' };
                viewModel = ctor(owner, []);
                viewModel.collaboratorAdded(collaborator);
                expect(viewModel.members().length).toBe(1);
            });
        });
    });
})