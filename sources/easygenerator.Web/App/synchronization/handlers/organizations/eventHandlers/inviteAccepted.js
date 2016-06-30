import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';

export default function(organizationUserId) {
    guard.throwIfNotString(organizationUserId, 'organizationUserId is not a string');

    app.trigger(constants.messages.organization.userStatusUpdated + organizationUserId, constants.organizationUserStatus.accepted);
}