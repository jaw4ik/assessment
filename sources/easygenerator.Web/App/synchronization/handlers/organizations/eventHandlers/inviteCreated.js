import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import organizationInviteMapper from 'mappers/organizationInviteMapper';
import userContext from 'userContext';

export default function(organizationInvite) {
    guard.throwIfNotAnObject(organizationInvite, 'organizationInvite is not an object');

    let invite = organizationInviteMapper.map(organizationInvite);
    userContext.identity.organizationInvites.push(invite);

    app.trigger(constants.messages.organization.inviteCreated, invite);
}