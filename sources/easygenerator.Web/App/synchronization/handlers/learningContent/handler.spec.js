import handler from './handler';

describe('synchronization learningContent [handler]', function () {

    describe('created:', function () {
        it('should be function', function () {
            expect(handler.created).toBeFunction();
        });
    });

    describe('updated:', function () {
        it('should be function', function () {
            expect(handler.updated).toBeFunction();
        });
    });

    describe('deleted:', function () {
        it('should be function', function () {
            expect(handler.deleted).toBeFunction();
        });
    });
});
