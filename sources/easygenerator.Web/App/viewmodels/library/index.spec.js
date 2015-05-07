define(['viewmodels/library/index'], function (index) {
    "use strict";

    var
        router = index.router,
        eventTracker = require('eventTracker');

    describe('viewModel [library index]', function () {

        beforeEach(function () {
            spyOn(router, 'navigate');
            spyOn(eventTracker, 'publish');
        });

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