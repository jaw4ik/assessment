import http from 'http/apiHttpWrapper';
import app from 'durandal/app';
import constants from 'constants';

export default class {
    static async execute(organizationId, userEmail) {
        await http.post('api/organization/user/remove', { organizationId: organizationId, userEmail: userEmail});

        app.trigger(constants.messages.organization.userRemoved + organizationId, userEmail);
    }
}