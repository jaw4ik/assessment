define(['synchronization/handlers/questions/question/handler'], function (handler) {
    "use strict";

    describe('synchronization question [handler]', function () {

        describe('titleUpdated:', function () {
            it('should be defined', function () {
                expect(handler.titleUpdated).toBeDefined();
            });
        });

        describe('contentUpdated:', function () {
            it('should be defined', function () {
                expect(handler.contentUpdated).toBeDefined();
            });
        });

        describe('correctFeedbackUpdated:', function () {
            it('should be defined', function () {
                expect(handler.correctFeedbackUpdated).toBeDefined();
            });
        });

        describe('incorrectFeedbackUpdated:', function () {
            it('should be defined', function () {
                expect(handler.incorrectFeedbackUpdated).toBeDefined();
            });
        });

        describe('created:', function () {
            it('should be defined', function () {
                expect(handler.created).toBeDefined();
            });
        });

        describe('deleted:', function () {
            it('should be defined', function () {
                expect(handler.deleted).toBeDefined();
            });
        });
    });

})