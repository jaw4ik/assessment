import _ from 'underscore';
import userContext from 'userContext';

export default class {
    static async execute(organizationId) {
        return new Promise((resolve, reject) => {
            var organization = _.find(userContext.identity.organizations, e => e.id === organizationId);
            if (organization) {
                resolve(organization);
            } else {
                reject('Organization not found');
            }
        });
    }
}