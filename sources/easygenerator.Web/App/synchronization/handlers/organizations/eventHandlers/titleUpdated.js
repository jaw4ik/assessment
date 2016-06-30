import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';

export default function(organizationId, organizationTitle) {
    guard.throwIfNotString(organizationId, 'organizationId is not a string');
    guard.throwIfNotString(organizationTitle, 'organizationTitle is not a string');

    app.trigger(constants.messages.organization.titleUpdated + organizationId, organizationTitle);
}