import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import userContext from 'userContext';

export default function(organizationId, userData) {
    guard.throwIfNotString(organizationId, 'Organization id is not a string');
    guard.throwIfNotAnObject(userData, 'User is not an object');
    
    let organization = _.find(userContext.identity.organizations, function (item) {
        return item.id === organizationId;
    });
    organization.grantsAdminAccess = userData.IsAdmin;

    app.trigger(constants.messages.organization.membershipUpdated, organizationId);
}

