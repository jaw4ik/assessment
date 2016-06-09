import command from 'organizations/commands/createOrganization';

import http from 'http/apiHttpWrapper';
import organizationMapper from 'mappers/organizationMapper';
import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';
import app from 'durandal/app';
import constants from 'constants';

describe('organizations commands [createOrganization]', () => {

    beforeEach(() => {
        spyOn(localizationManager, 'localize').and.callFake(arg => { return arg; });
        spyOn(app, 'trigger');
        userContext.identity= {
            organizations: []
        }
    });

    describe('execute:', () => {
        var organizationData = { Id: 'id' },
            organization = { id: 'id' };

        beforeEach(() => {
            spyOn(organizationMapper, 'map').and.returnValue(organization);
        });

        it('should send request to create organization', done => (async () => {
            spyOn(http, 'post').and.returnValue(Promise.resolve(true));
                
            await command.execute();
                
            expect(http.post).toHaveBeenCalledWith('api/organization/create', { title: 'newOrganizationTitle'});
                
        })().then(done));

        describe('and when organization created successfully', () => {
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.resolve(organizationData));
            });

            it('should map organization model', done => (async () => {
                await command.execute();
                
                expect(organizationMapper.map).toHaveBeenCalledWith(organizationData);
                
            })().then(done));

            it('should add organization model to userContext organizations collection', done => (async () => {
                await command.execute();
                
                expect(userContext.identity.organizations.length).toBe(1);
                expect(userContext.identity.organizations[0]).toBe(organization);

            })().then(done));

            it('should trigger organization created event ', done => (async () => {
                await command.execute();
                
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.created, organization);

            })().then(done));
        });

        describe('and when failed to create organization', () => {
            
            beforeEach(() => {
                spyOn(http, 'post').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await command.execute();

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));
        });
    });
    
});