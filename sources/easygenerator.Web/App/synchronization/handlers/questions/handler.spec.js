define(['synchronization/handlers/questions/handler'], function (handler) {
    "use strict";

    describe('synchronization questions [handler]', function () {

        describe('dragAndDropText:', function () {
            it('should be defined', function () {
                expect(handler.dragAndDropText).toBeDefined();
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

        describe('hotSpot:', function () {
            it('should be defined', function () {
                expect(handler.hotSpot).toBeDefined();
            });
        });

        describe('scenario:', function () {
            it('should be defined', function () {
                expect(handler.scenario).toBeDefined();
            });
        });

    });

})