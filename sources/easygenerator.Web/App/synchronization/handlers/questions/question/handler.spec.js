import handler from './handler';

describe('synchronization question [handler]', function () {

    describe('titleUpdated:', function () {
        it('should be defined', function () {
            expect(handler.titleUpdated).toBeDefined();
        });
    });

    describe('voiceOverUpdated:', function () {
        it('should be defined', function () {
            expect(handler.voiceOverUpdated).toBeDefined();
        });
    });

    describe('contentUpdated:', function () {
        it('should be defined', function () {
            expect(handler.contentUpdated).toBeDefined();
        });
    });

    describe('backgroundChanged:', function () {
        it('should be function', function () {
            expect(handler.backgroundChanged).toBeFunction();
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
