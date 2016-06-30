import command from 'organizations/commands/addUsers';

import http from 'http/apiHttpWrapper';
import app from 'durandal/app';
import constants from 'constants';
import organizationUserMapper from 'mappers/organizationUserMapper';

describe('organizations commands [addUsers]', () => {

    describe('execute:', () => {
        var usersData = [{ Id: 'id' }, { Id: 'id' }],
            emails=['email1', 'email2'],
            organizationId = 'id';

        beforeEach(() => {
            spyOn(app, 'trigger');
            spyOn(organizationUserMapper, 'map').and.callFake(arg => { return {id: arg.Id}; });
        });

        it('should send request to add organization users', done => (async () => {
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationId, emails);
                
            expect(http.post).toHaveBeenCalledWith('api/organization/users/add', { organizationId: organizationId, emails: emails});
                
        })().then(done));

        describe('and when organization users added successfully', () => {
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.resolve(usersData));
            });

            it('should map organization users models', done => (async () => {
                await command.execute(organizationId, emails);
                
                expect(organizationUserMapper.map).toHaveBeenCalled();
                
            })().then(done));

            it('should trigger organization users added event ', done => (async () => {
                await command.execute(organizationId, emails);
                
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.usersAdded + organizationId, [{id: usersData[0].Id}, {id: usersData[1].Id}]);

            })().then(done));
        });

        describe('and when failed to add organization users', () => {
            
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await command.execute(organizationId, emails);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});