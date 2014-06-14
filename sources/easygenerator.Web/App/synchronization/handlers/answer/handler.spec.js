define(['synchronization/handlers/answer/handler'], function (handler) {
    "use strict";

    describe('synchronization answer [handler]', function () {

        describe('created:', function () {
            it('should be function', function () {
                expect(handler.created).toBeFunction();
            });
        });

        describe('deleted:', function () {
            it('should be function', function () {
                expect(handler.deleted).toBeFunction();
            });
        });

    });

})