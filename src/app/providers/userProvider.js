(function() {
    'use strict';

    angular.module('assessment')
           .provider('user', userProvider);

    function userProvider() {
        var user = null;
        return {
            set: function (value) {
                if (!_.isObject(value) || !(value.username || value.email)) {
                    return;
                }

                user = value;
            },
            use: function (userInfoProvider) {
                if(!userInfoProvider) {
                    return;
                }
                var accountId = userInfoProvider.getAccountId(),
                    accountHomePage = userInfoProvider.getAccountHomePage(),
                    username = userInfoProvider.getUsername();
                if(!accountId || !accountHomePage || !username) {
                    return;
                }
                user = {
                    email: accountId,
                    username: username,
                    account: {
                        homePage: accountHomePage,
                        name: accountId
                    }
                };
            },
            $get: function () {
                return user;
            }
        };
    }
}());