import command from 'organizations/commands/removeUser';

import http from 'http/apiHttpWrapper';
import app from 'durandal/app';
import constants from 'constants';

describe('organizations commands [removeUser]', () => {

    describe('execute:', () => {
        var userEmail = 'email',
            organizationId = 'id';

        beforeEach(() => {
            spyOn(app, 'trigger');
        });

        it('should send request to remove organization user', done => (async () => {
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationId, userEmail);
                
            expect(http.post).toHaveBeenCalledWith('api/organization/user/remove', { organizationId: organizationId, userEmail: userEmail});
                
        })().then(done));

        describe('and when organization user removed successfully', () => {
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.resolve(true));
            });

            it('should trigger organization user removed event ', done => (async () => {
                await command.execute(organizationId, userEmail);
                
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.userRemoved + organizationId, userEmail);

            })().then(done));
        });

        describe('and when failed to remove organization user', () => {
            
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await command.execute(organizationId, userEmail);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});