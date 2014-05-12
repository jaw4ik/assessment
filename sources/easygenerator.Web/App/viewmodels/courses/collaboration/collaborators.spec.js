define(function (require) {
    "use strict";

    var
        ctor = require('viewmodels/courses/collaboration/collaborators')
    ;

    describe('viewModel [collaborators]', function () {

        var viewModel;
        var owner = "user@user.com";

        beforeEach(function () {
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

        describe('addMember:', function() {
            it('should be function', function () {
                viewModel = ctor('', []);
                expect(viewModel.addMember).toBeFunction();
            });
        });
    });
})