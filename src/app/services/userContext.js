(function () {
    "use strict";
    angular.module('assessment')
		.service('userContext', userContext);

    userContext.$inject = ['user'];

    function userContext(user) {
        var currentUser = user || {},
            isInitialized = false;

        function getCurrentUser(){
            return currentUser.email && currentUser.username ? currentUser : null;
        }

        function set(email, username){
            currentUser.email = email;
            currentUser.username = username;
        }

        function clear() {
            currentUser.email = null;
            currentUser.username = null;
        }

        return {
            getCurrentUser: getCurrentUser,
            set: set,
            clear: clear
        };
    }

})();