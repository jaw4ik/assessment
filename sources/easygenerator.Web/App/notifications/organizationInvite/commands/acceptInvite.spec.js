import command from './acceptInvite';
import userContext from 'userContext';
import http from 'http/apiHttpWrapper';
import app from 'durandal/app';
import constants from 'constants';

describe('notifications organization invite commands [acceptInvite]', () => {
    beforeEach(() => {
        userContext.identity = {};
        spyOn(app, 'trigger');
    });

    describe('execute:', () => {
        var organizationUserId = 'userId';

        it('should send request to accept invite', done => (async () => {
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationUserId);
                
            expect(http.post).toHaveBeenCalledWith('api/organization/invite/accept', { organizationUserId: organizationUserId});
                
        })().then(done));

        it('should remove invite from user context', done => (async () => {
            userContext.identity.organizationInvites = [{ id: organizationUserId }];
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationUserId);
            expect(userContext.identity.organizationInvites.length).toBe(0);

        })().then(done));

        it('should trigger app event', done => (async () => {
            userContext.identity.organizationInvites = [{ id: organizationUserId }];
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationUserId);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.userStatusUpdated);

        })().then(done));

        it('should remove invite from user context', done => (async () => {
            userContext.identity.organizationInvites = [{ id: organizationUserId }];
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationUserId);
            expect(userContext.identity.organizationInvites.length).toBe(0);

        })().then(done));

        describe('and when failed to accept organization invite', () => {
            
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await command.execute(organizationUserId);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});