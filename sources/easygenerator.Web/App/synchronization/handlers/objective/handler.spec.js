define(['synchronization/handlers/objective/handler'], function (handler) {
    "use strict";

    describe('synchronization objective [handler]', function () {

        describe('questionsReordered:', function () {
            it('should be function', function () {
                expect(handler.questionsReordered).toBeFunction();
            });
        });

        describe('titleUpdated:', function () {
            it('should be function', function () {
                expect(handler.titleUpdated).toBeFunction();
            });
        });

        describe('imageUrlUpdated:', function () {
            it('should be function', function() {
                expect(handler.imageUrlUpdated).toBeFunction();
            });
        });

    });

})