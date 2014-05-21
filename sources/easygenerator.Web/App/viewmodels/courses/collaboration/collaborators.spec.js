define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/courses/collaboration/collaborators'),
        dialog = require('plugins/dialog'),
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

        describe('collaboratorAdded:', function () {
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