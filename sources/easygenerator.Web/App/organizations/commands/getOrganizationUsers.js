import _ from 'underscore';
import http from 'http/apiHttpWrapper';
import organizationUserMapper from 'mappers/organizationUserMapper';

export default class {
    static async execute(organizationId) {
        var usersData = await http.post('api/organization/users', { organizationId: organizationId });
        return _.map(usersData, userData => organizationUserMapper.map(userData));
    }
}