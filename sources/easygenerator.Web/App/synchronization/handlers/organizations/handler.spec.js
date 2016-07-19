import handler from './handler';

describe('synchronization organizations [handler]', () => {

    describe('userRegistered:', () => {
        it('should be function', () => {
            expect(handler.userRegistered).toBeFunction();
        });
    });

    describe('inviteAccepted:', () => {
        it('should be function', () => {
            expect(handler.inviteAccepted).toBeFunction();
        });
    });

    describe('inviteDeclined:', () => {
        it('should be function', () => {
            expect(handler.inviteDeclined).toBeFunction();
        });
    });

    describe('inviteCreated:', () => {
        it('should be function', () => {
            expect(handler.inviteCreated).toBeFunction();
        });
    });

    describe('inviteRemoved:', () => {
        it('should be function', () => {
            expect(handler.inviteRemoved).toBeFunction();
        });
    });

    describe('titleUpdated:', () => {
        it('should be function', () => {
            expect(handler.titleUpdated).toBeFunction();
        });
    });

    describe('membershipStarted:', () => {
        it('should be function', () => {
            expect(handler.membershipStarted).toBeFunction();
        });
    });

    describe('membershipFinished:', () => {
        it('should be function', () => {
            expect(handler.membershipFinished).toBeFunction();
        });
    });

    describe('userAdded:', () => {
        it('should be function', () => {
            expect(handler.userAdded).toBeFunction();
        });
    });
});
