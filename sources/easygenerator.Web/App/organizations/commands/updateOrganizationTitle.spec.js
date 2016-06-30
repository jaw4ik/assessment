import command from 'organizations/commands/updateOrganizationTitle';

import http from 'http/apiHttpWrapper';
import userContext from 'userContext';
import app from 'durandal/app';
import constants from 'constants';

describe('organizations commands [updateOrganizationTitle]', () => {

    describe('execute:', () => {
        var organization,
            title = 'title',
            organizationId = 'id';

        beforeEach(() => {
            organization = { id: organizationId, title: '' };
            spyOn(app, 'trigger');
        });

        it('should send request to update organizatin title', done => (async () => {
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute(organizationId, title);
                
            expect(http.post).toHaveBeenCalledWith('api/organization/title/update', { organizationId: organizationId, title: title});
                
        })().then(done));

        describe('and when organization title updated successfully', () => {
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.resolve(true));
            });

            it('should update user context organization', done => (async () => {
                userContext.identity = { organizations: [organization] };

                await command.execute(organizationId, title);
                
                expect(userContext.identity.organizations[0].title).toBe(title);
                
            })().then(done));

            it('should trigger app event', done => (async () => {
                userContext.identity = { organizations: [organization] };

                await command.execute(organizationId, title);
                
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.titleUpdated, { id: organizationId, title: title });
                
            })().then(done));
        });

        describe('and when failed to update organization title', () => {
            
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await command.execute(organizationId, title);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});