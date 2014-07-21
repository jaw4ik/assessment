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

        describe('fillInTheBlankUpdated:', function () {
            it('should be function', function () {
                expect(handler.fillInTheBlankUpdated).toBeFunction();
            });
        });

        describe('deleted:', function () {
            it('should be function', function () {
                expect(handler.deleted).toBeFunction();
            });
        });

        describe('dragAndDropBackgroundChanged:', function () {
            it('should be function', function () {
                expect(handler.dragAndDropBackgroundChanged).toBeFunction();
            });
        });

        describe('dragAndDropDropspotCreated:', function () {
            it('should be function', function () {
                expect(handler.dragAndDropDropspotCreated).toBeFunction();
            });
        });

        describe('dragAndDropDropspotDeleted:', function () {
            it('should be function', function () {
                expect(handler.dragAndDropDropspotDeleted).toBeFunction();
            });
        });

        describe('dragAndDropDropspotTextChanged:', function () {
            it('should be function', function () {
                expect(handler.dragAndDropDropspotTextChanged).toBeFunction();
            });
        });

        describe('dragAndDropDropspotPositionChanged:', function () {
            it('should be function', function () {
                expect(handler.dragAndDropDropspotPositionChanged).toBeFunction();
            });
        });

        describe('textMatchingAnswerCreated:', function () {
            it('should be function', function () {
                expect(handler.textMatchingAnswerCreated).toBeFunction();
            });
        });

        describe('textMatchingAnswerDeleted:', function () {
            it('should be function', function () {
                expect(handler.textMatchingAnswerDeleted).toBeFunction();
            });
        });

        describe('textMatchingAnswerKeyChanged:', function () {
            it('should be function', function () {
                expect(handler.textMatchingAnswerKeyChanged).toBeFunction();
            });
        });

        describe('textMatchingAnswerValueChanged:', function () {
            it('should be function', function () {
                expect(handler.textMatchingAnswerValueChanged).toBeFunction();
            });
        });
    });

})