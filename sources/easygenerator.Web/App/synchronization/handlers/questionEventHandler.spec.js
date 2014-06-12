define(['synchronization/handlers/questionEventHandler'], function (handler) {
    "use strict";

    describe('synchronization [questionEventHandler]', function () {

        describe('titleUpdated:', function () {
            it('should be function', function () {
                expect(handler.titleUpdated).toBeFunction();
            });
        });

        describe('contentUpdated:', function () {
            it('should be function', function () {
                expect(handler.contentUpdated).toBeFunction();
            });
        });

    });

})