import http from 'http/apiHttpWrapper';
import constants from 'constants';
import userContext from 'userContext';
import app from 'durandal/app';

export default class {
    static async execute(organizationUserId) {
        await http.post('api/organization/invite/decline', { organizationUserId: organizationUserId});
        userContext.identity.organizationInvites = _.reject(userContext.identity.organizationInvites, function (item) {
            return item.id === organizationUserId;
        });

        app.trigger(constants.messages.organization.userStatusUpdated);
    }
}