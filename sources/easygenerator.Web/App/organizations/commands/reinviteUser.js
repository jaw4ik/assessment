import http from 'http/apiHttpWrapper';
import app from 'durandal/app';
import constants from 'constants';

export default class {
    static async execute(organizationId, organizationUserId) {
        await http.post('api/organization/user/reinvite', { organizationId: organizationId, organizationUserId: organizationUserId});
        app.trigger(constants.messages.organization.userStatusUpdated + organizationUserId, constants.organizationUserStatus.waitingForAcceptance);
    }
}