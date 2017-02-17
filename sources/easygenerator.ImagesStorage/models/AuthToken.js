'use strict';

class AuthToken {
    constructor (userInfo) {
        this.email = userInfo.unique_name;
    }
}

module.exports = AuthToken;