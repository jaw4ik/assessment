import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';

export default function(organizationId, organizationUserId) {
    guard.throwIfNotString(organizationId, 'organizationId is not a string');
    guard.throwIfNotString(organizationUserId, 'organizationUserId is not a string');

    app.trigger(constants.messages.organization.userStatusUpdated + organizationUserId, constants.organizationUserStatus.declined);
}