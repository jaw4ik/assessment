define(['synchronization/handlers/learningContent/handler'], function (handler) {
    "use strict";

    describe('synchronization learningContent [handler]', function () {

        describe('created:', function () {
            it('should be function', function () {
                expect(handler.created).toBeFunction();
            });
        });

        describe('textUpdated:', function () {
            it('should be function', function () {
                expect(handler.textUpdated).toBeFunction();
            });
        });

        describe('deleted:', function () {
            it('should be function', function () {
                expect(handler.deleted).toBeFunction();
            });
        });
    });

})