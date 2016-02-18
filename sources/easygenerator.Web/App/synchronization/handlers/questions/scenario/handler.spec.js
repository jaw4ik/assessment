import handler from './handler';

describe('synchronization questions scenario [handler]', function () {

    describe('dataUpdated:', function () {
        it('should be defined', function () {
            expect(handler.dataUpdated).toBeDefined();
        });
    });

    describe('masteryScoreUpdated:', function () {
        it('should be defined', function () {
            expect(handler.masteryScoreUpdated).toBeDefined();
        });
    });

});
