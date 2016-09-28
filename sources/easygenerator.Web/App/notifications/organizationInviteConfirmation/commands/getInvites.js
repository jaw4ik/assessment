import _ from 'underscore';
import constants from 'constants';
import userContext from 'userContext';

export default class {
    static async execute() {
        return new Promise((resolve) => {
            resolve(_.filter(userContext.identity.organizationInvites, invite => invite.status === constants.organizationUserStatus.waitingForEmailConfirmation));
        });
    }
}