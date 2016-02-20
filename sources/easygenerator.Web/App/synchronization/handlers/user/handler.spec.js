import handler from './handler';

describe('synchronization user [handler]', function () {

    describe('upgradedToStarter:', function () {
        it('should be function', function () {
            expect(handler.upgradedToStarter).toBeFunction();
        });
    });

    describe('upgradedToPlus:', function () {
        it('should be function', function () {
            expect(handler.upgradedToPlus).toBeFunction();
        });
    });

    describe('downgraded:', function () {
        it('should be function', function () {
            expect(handler.downgraded).toBeFunction();
        });

    });

});
