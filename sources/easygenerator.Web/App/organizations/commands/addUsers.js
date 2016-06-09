import http from 'http/apiHttpWrapper';
import app from 'durandal/app';
import constants from 'constants';
import organizationUserMapper from 'mappers/organizationUserMapper';

export default class {
    static async execute(organizationId, emails) {
        var usersData = await http.post('api/organization/users/add', { organizationId: organizationId, emails: emails});
        var users = _.map(usersData, userData => organizationUserMapper.map(userData));
        app.trigger(constants.messages.organization.usersAdded + organizationId, users);
    }
}