import command from 'organizations/commands/getOrganizationUsers';

import http from 'http/apiHttpWrapper';
import organizationUserMapper from 'mappers/organizationUserMapper';

describe('organizations commands [getOrganizationUsers]', () => {

    describe('execute:', () => {
        var usersData = [{ Id: 'id' }, { Id: 'id' }],
            organizationId = 'id';

        beforeEach(() => {
            spyOn(organizationUserMapper, 'map').and.callFake(arg => { return {id: arg.Id}; });
        });

        it('should send request to get organization users', done => (async () => {
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationId);
                
            expect(http.post).toHaveBeenCalledWith('api/organization/users', { organizationId: organizationId});
                
        })().then(done));

        describe('and when organization users received successfully', () => {
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.resolve(usersData));
            });

            it('should map organization users collection', done => (async () => {
                await command.execute(organizationId);
                
                expect(organizationUserMapper.map).toHaveBeenCalled();
                
            })().then(done));

            it('should return organization users collection', done => (async () => {
                var users = await command.execute(organizationId);

                expect(users.length).toBe(2);
                expect(users[0].id).toBe(usersData[0].Id);
                expect(users[1].id).toBe(usersData[1].Id);
                
            })().then(done));
        });

        describe('and when failed to get organization users', () => {
            
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await command.execute(organizationId);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});