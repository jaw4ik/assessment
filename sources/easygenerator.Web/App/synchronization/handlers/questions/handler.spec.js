define(['synchronization/handlers/questions/handler'], function (handler) {
    "use strict";

    describe('synchronization questions [handler]', function () {

        describe('dragAndDrop:', function () {
            it('should be defined', function () {
                expect(handler.dragAndDrop).toBeDefined();
            });
        });

        describe('fillInTheBlank:', function () {
            it('should be defined', function () {
                expect(handler.fillInTheBlank).toBeDefined();
            });
        });

        describe('question:', function () {
            it('should be defined', function () {
                expect(handler.question).toBeDefined();
            });
        });

        describe('textMatching:', function () {
            it('should be defined', function () {
                expect(handler.textMatching).toBeDefined();
            });
        });

        describe('singleSelectImage:', function () {
            it('should be defined', function () {
                expect(handler.singleSelectImage).toBeDefined();
            });
        });
    });

})