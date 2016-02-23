import handler from 'synchronization/handlers/comment/handler';

describe('synchronization comment [handler]', () => {
    
    describe('deleted:', () => {
        it('should be function', () => {
            expect(handler.deleted).toBeFunction();
        });
    });

    describe('created:', () => {
        it('should be function', () => {
            expect(handler.created).toBeFunction();
        });
    });
});