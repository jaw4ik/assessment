import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import userContext from 'userContext';

export default function(organizationId, organizationTitle) {
    guard.throwIfNotString(organizationId, 'organizationId is not a string');
    guard.throwIfNotString(organizationTitle, 'organizationTitle is not a string');

    var organization = _.find(userContext.identity.organizations, e => e.id === organizationId);
    if (organization) {
        organization.title = organizationTitle;
    }

    app.trigger(constants.messages.organization.titleUpdated, organizationId, organizationTitle);
}