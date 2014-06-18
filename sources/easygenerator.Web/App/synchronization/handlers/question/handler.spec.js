define(['synchronization/handlers/question/handler'], function (handler) {
    "use strict";

    describe('synchronization question [handler]', function () {

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