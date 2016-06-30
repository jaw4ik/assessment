import command from './getInvites';
import userContext from 'userContext';

describe('notifications organization invite commands [getInvites]', () => {

    beforeEach(() => {
        userContext.identity = {

        };
    });

    describe('execute:', () => {
        var invites = [{}, {}];

        it('should return invites', done => (async () => {
            userContext.identity.organizationInvites = invites;
                
            let result = await command.execute();
                
            expect(result).toBe(invites);
                
        })().then(done));
    });
    
});