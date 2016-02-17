import handler from './handler';

describe('synchronization question dragAndDropText [handler]', function () {

    describe('dropspotCreated:', function () {
        it('should be function', function () {
            expect(handler.dropspotCreated).toBeFunction();
        });
    });

    describe('dropspotDeleted:', function () {
        it('should be function', function () {
            expect(handler.dropspotDeleted).toBeFunction();
        });
    });

    describe('dropspotTextChanged:', function () {
        it('should be function', function () {
            expect(handler.dropspotTextChanged).toBeFunction();
        });
    });

    describe('dropspotPositionChanged:', function () {
        it('should be function', function () {
            expect(handler.dropspotPositionChanged).toBeFunction();
        });
    });
});
