import command from 'organizations/commands/reinviteUser';

import http from 'http/apiHttpWrapper';
import app from 'durandal/app';
import constants from 'constants';

describe('organizations commands [reinviteUser]', () => {

    describe('execute:', () => {
        var organizationUserId = 'id',
            organizationId = 'orgId';

        beforeEach(() => {
            spyOn(app, 'trigger');
        });

        it('should send request to reinvite organization user', done => (async () => {
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationId, organizationUserId);
                
            expect(http.post).toHaveBeenCalledWith('api/organization/user/reinvite', { organizationId: organizationId, organizationUserId: organizationUserId});
                
        })().then(done));

        describe('and when organization user reinvited successfully', () => {
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.resolve(true));
            });

            it('should trigger organization user status updated event ', done => (async () => {
                await command.execute(organizationId, organizationUserId);
                
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.userStatusUpdated + organizationUserId, constants.organizationUserStatus.waitingForAcceptance);

            })().then(done));
        });

        describe('and when failed to reinvite organization user', () => {
            
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await command.execute(organizationId, organizationUserId);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});