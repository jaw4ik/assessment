import app from 'durandal/app';
import _ from 'underscore';
import guard from 'guard';
import constants from 'constants';
import userContext from 'userContext';

export default function(organizationId) {
    guard.throwIfNotString(organizationId, 'organizationId is not a string');

    userContext.identity.organizations = _.reject(userContext.identity.organizations, function (item) {
        return item.id === organizationId;
    });

    app.trigger(constants.messages.organization.membershipFinished, organizationId);
}