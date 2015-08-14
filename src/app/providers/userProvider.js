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
            $get: function () {
                return user;
            }
        };
    }
}());