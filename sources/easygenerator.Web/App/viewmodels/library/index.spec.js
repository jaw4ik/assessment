define(['viewmodels/library/index'], function (index) {
    "use strict";

    var
        router = index.router;

    describe('viewModel [library index]', function () {

        it('should be defined', function () {
            expect(index).toBeDefined();
        });

        describe('index router', function () {

            it('should be defined', function () {
                expect(router).toBeDefined();
            });

        });

    });

});