import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import organizationUserMapper from 'mappers/organizationUserMapper';

export default function(organizationId, userData) {
    guard.throwIfNotString(organizationId, 'Organization id is not a string');
    guard.throwIfNotAnObject(userData, 'User is not an object');

    app.trigger(constants.messages.organization.usersAdded + organizationId, [organizationUserMapper.map(userData)]);
}