import userContext from 'userContext';

export default class {
    static async execute() {
        return new Promise((resolve) => {
            resolve(userContext.identity.organizationInvites);
        });
    }
}