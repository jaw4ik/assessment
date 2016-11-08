(function () {
    'use strict';
    angular.module('assessment.publishSettings')
           .service('publishModulesInitializer', PublishModulesInitializer);

    PublishModulesInitializer.$inject = ['$rootScope'];

    function PublishModulesInitializer($rootScope) {
        var that = this;

        that.init = function(modules) {
            _.each(modules, function(module) {
                initModule(module);
            });
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
            if (_.isFunction(module.courseFinalized)) {
                $rootScope.$on('course:finalized', function (scope, data) {
                    module.courseFinalized();
                });
            }
        }
    }
}());