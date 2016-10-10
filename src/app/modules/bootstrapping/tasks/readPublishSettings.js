(function () {
    'use strict';

    angular.module('bootstrapping').factory('readPublishSettingsTask', readPublishSettingsTask);

    readPublishSettingsTask.$inject = ['$q', 'fileReadingService', 'publishModuleLoader'];

    function readPublishSettingsTask($q, fileReadingService, publishModuleLoader) {
        return fileReadingService.readJson('publishSettings.js').then(function(publishSettings) {
            var result = {
                publishSettings: publishSettings,
                publishModules: []
            };
            if (publishSettings && publishSettings.modules && publishSettings.modules.length > 0) {
                var promises = [];
                _.each(publishSettings.modules, function(module) {
                    promises.push(publishModuleLoader.load(module.name).then(function(moduleInstance) {
                        return moduleInstance;
                    }, function() {
                        throw 'Cannot load publish module "' + module.name + '".';
                    }));
                });

                return $q.all(promises).then(function(data){
                    result.publishModules = data;
                    return result;
                });
            }
            return result;
        });
    }

}());