import command from './getInvites';
import userContext from 'userContext';
import constants from 'constants';

describe('notifications organization invite commands [getInvites]', () => {

    beforeEach(() => {
        userContext.identity = {

        };
    });

    describe('execute:', () => {
        var invites = [{ status: constants.organizationUserStatus.waitingForAcceptance }, { status: constants.organizationUserStatus.accepted }];

        it('should return invites', done => (async () => {
            userContext.identity.organizationInvites = invites;
                
            let result = await command.execute();
                
            expect(result.length).toBe(1);
                
        })().then(done));
    });
    
});