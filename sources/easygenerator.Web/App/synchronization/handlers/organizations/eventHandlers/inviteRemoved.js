import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import userContext from 'userContext';

export default function(organizationUserId) {
    guard.throwIfNotString(organizationUserId, 'organizationUserId is not a string');

    userContext.identity.organizationInvites = _.reject(userContext.identity.organizationInvites, function (item) {
        return item.id === organizationUserId;
    });

    app.trigger(constants.messages.organization.inviteRemoved, organizationUserId);
}