define([],
    function () {

        "use strict";

        var
            modules = [],

            modulesManager = {
                register: register,
                init: init,
                
                _checkAndInitModules: _checkAndInitModules
            };

        return modulesManager;

        function register(modulesList) {
            if (_.isNullOrUndefined(modulesList)) {
                return;
            }

            modules = _.isArray(modulesList)
                ? modulesList
                : [modulesList];
        }

        function init() {
            var defer = Q.defer();

            if (modules.length == 0) {
                defer.resolve();
            }

            require(modules, function () {
                _checkAndInitModules(arguments).then(defer.resolve);
            });

            return defer.promise;
        }

        function _checkAndInitModules(loadedModules) {
            if (loadedModules.length == 0) {
                throw "Neither module has not been initialized";
            }

            var promises = [];
            for (var index in loadedModules) {
                var module = loadedModules[index];

                if (_.isNullOrUndefined(module)) {
                    throw "Module '" + modules[index] + "' is not defined";
                }
                if (!_.isFunction(module.initialize)) {
                    throw "Module '" + modules[index] + "' must have function 'initialize'";
                }
                promises.push(module.initialize());
            }
            return Q.allSettled(promises);
        }
    }
);