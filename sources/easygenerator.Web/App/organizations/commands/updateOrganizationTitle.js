import http from 'http/apiHttpWrapper';
import userContext from 'userContext';
import app from 'durandal/app';
import constants from 'constants';

export default class {
    static async execute(organizationId, title) {
        await http.post('api/organization/title/update', { organizationId: organizationId, title: title });
        var organization = _.find(userContext.identity.organizations, e => e.id === organizationId);
        if (organization) {
            organization.title = title;
        }

        app.trigger(constants.messages.organization.titleUpdated, organizationId, title);
    }
}