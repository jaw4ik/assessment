define(['synchronization/handlers/questions/textMatching/handler'], function (handler) {
    "use strict";

    describe('synchronization question textMatching [handler]', function () {

        describe('answerCreated:', function () {
            it('should be function', function () {
                expect(handler.answerCreated).toBeFunction();
            });
        });

        describe('answerDeleted:', function () {
            it('should be function', function () {
                expect(handler.answerDeleted).toBeFunction();
            });
        });

        describe('answerKeyChanged:', function () {
            it('should be function', function () {
                expect(handler.answerKeyChanged).toBeFunction();
            });
        });

        describe('answerValueChanged:', function () {
            it('should be function', function () {
                expect(handler.answerValueChanged).toBeFunction();
            });
        });
    });

})