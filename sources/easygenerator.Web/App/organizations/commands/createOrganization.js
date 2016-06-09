import http from 'http/apiHttpWrapper';
import organizationMapper from 'mappers/organizationMapper';
import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';
import app from 'durandal/app';
import constants from 'constants';

export default class {
    static async execute() {
        var organizationData = await http.post('api/organization/create', { title: localizationManager.localize('newOrganizationTitle') });
        var organization = organizationMapper.map(organizationData);
        userContext.identity.organizations.push(organization);

        app.trigger(constants.messages.organization.created, organization);

        return organization;
    }
}