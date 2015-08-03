(function () {
    'use strict';
    angular.module('assessment.publishSettings')
           .service('publishModulesInitializer', PublishModulesInitializer);

    PublishModulesInitializer.$inject = ['$rootScope', '$q', 'publishModuleLoader'];

    function PublishModulesInitializer($rootScope, $q, publishModuleLoader) {
        var that = this;

        that.init = function(modules) {
            var promises = {};
            _.each(modules, function(module) {
                promises[module.name] = publishModuleLoader.load(module.name).then(
                    function(moduleInstance) {
                        initModule(moduleInstance);
                    },
                    function() {
                        throw 'Cannot load publish module "' + module.name + '".';
                    });
            });

            return $q.all(promises);
        };

        function initModule(module) {
            if (_.isFunction(module.initialize)) {
                module.initialize();
            }
            if (_.isFunction(module.courseFinished)) {
                $rootScope.$on('course:finished', function (scope, data) {
                    var eventData = {
                        result: data.getResult() / 100,
                        isCompleted: data.isCompleted
                    };

                    module.courseFinished(eventData);
                });
            }
        }
    }
}());