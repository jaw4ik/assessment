import command from 'organizations/commands/getOrganization';

import userContext from 'userContext';

describe('organizations commands [getOrganization]', () => {

    describe('execute:', () => {
        var organization = { id: 'id' };

        describe('and when organization is found', () => {
            beforeEach(() => {
                userContext.identity = {
                    organizations: [organization]
                };
            });

            it('should resolve promise with organization', done => (async () => {
                var result = await command.execute(organization.id);
                
                expect(result).toBe(organization);
                
            })().then(done));
        });

        describe('and when organization is not found', () => {
            
            beforeEach(() => {
                userContext.identity = {
                    organizations: []
                };
            });

            it('should reject promise', done => (async () => {
                await command.execute(organization.id);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});