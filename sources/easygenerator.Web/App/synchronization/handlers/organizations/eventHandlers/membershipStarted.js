import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import userContext from 'userContext';
import organizationMapper from 'mappers/organizationMapper';

export default function(organizationData) {
    guard.throwIfNotAnObject(organizationData, 'organizationData is not an object');

    let organization = organizationMapper.map(organizationData);
    userContext.identity.organizations.push(organization);

    app.trigger(constants.messages.organization.membershipStarted, organization);
}