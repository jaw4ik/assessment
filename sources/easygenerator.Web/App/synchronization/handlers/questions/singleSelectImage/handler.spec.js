define(['synchronization/handlers/questions/singleSelectImage/handler'], function (handler) {
    "use strict";

    describe('synchronization questions singleSelectImage [handler]', function () {

        describe('answerCreated:', function () {
            it('should be defined', function () {
                expect(handler.answerCreated).toBeDefined();
            });
        });

        describe('answerDeleted:', function () {
            it('should be defined', function () {
                expect(handler.answerDeleted).toBeDefined();
            });
        });

        describe('answerImageUpdated:', function () {
            it('should be defined', function () {
                expect(handler.answerImageUpdated).toBeDefined();
            });
        });

        describe('correctAnswerChanged:', function () {
            it('should be defined', function () {
                expect(handler.correctAnswerChanged).toBeDefined();
            });
        });
    });

})