import handler from './handler';

describe('synchronization question hotSpot [handler]', function () {
        
    describe('polygonCreated:', function () {
        it('should be function', function () {
            expect(handler.polygonCreated).toBeFunction();
        });
    });

    describe('polygonDeleted:', function () {
        it('should be function', function () {
            expect(handler.polygonDeleted).toBeFunction();
        });
    });

    describe('polygonChanged:', function () {
        it('should be function', function () {
            expect(handler.polygonChanged).toBeFunction();
        });
    });

    describe('isMultipleChanged:', function () {
        it('should be function', function () {
            expect(handler.isMultipleChanged).toBeFunction();
        });
    });
});
