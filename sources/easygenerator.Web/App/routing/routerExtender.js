define(['durandal/app', 'plugins/router', 'localization/localizationManager'], function (app, router, localizationManager) {
   
    function execute() {
        router.openUrl = function (url) {
            window.open(url, '_blank');
        };

        router.updateDocumentTitle = function (instance, instruction) {
            var title = null;

            if (instruction.config.settings && instruction.config.settings.localizationKey) {
                title = localizationManager.localize(instruction.config.settings.localizationKey);

            } else if (instruction.config.title) {
                title = instruction.config.title;
            }

            document.title = title ? app.title + ' | ' + title : app.title;
        };

        router.replace = function (url) {
            router.navigate(url, { replace: true, trigger: true });
        };

        router.reloadLocation = function () {
            document.location.reload();
        };

        router.setLocation = function (url) {
            document.location = url;
        };

        router.navigateWithQueryString = function (url) {
            var queryString = router.activeInstruction().queryString;
            router.navigate(_.isNullOrUndefined(queryString) ? url : url + '?' + queryString);
        };

        router.download = function (url) {
            var hash = window.location.hash,
                href = window.location.href;
            var downloadUrl = hash == '' ? href + '/' + url : href.replace(hash, url);
            window.open(downloadUrl);
        };
        
        router.on('router:navigation:composition-complete').then(function () {
            $(document).scrollTop(0);
        });
      
        // add routeData to routing
        var namedParamPattern = /(\(\?)?:\w+/g;
        var defaultRouteData = {
            courseId: null,
            moduleName: null
        };
        
        router.routeData = ko.observable(defaultRouteData);

        router.activeInstruction.subscribe(function (instruction) {
            if (_.isObject(instruction) && _.isObject(instruction.config)) {
                var routeParams = {};
                var urlFragment = instruction.config.route;
                var match, routeParam, counter = 0;

                // intialize route params
                if (urlFragment) {
                    while ((match = namedParamPattern.exec(urlFragment))) {
                        if (match[0]) {
                            routeParam = match[0].replace(':', '');
                            var paramValue = instruction.params[counter++];
                            if (_.isString(paramValue)) {
                                routeParams[routeParam] = paramValue;
                            }
                        }
                    }
                }

                // merge queryParams to routeParams
                if (instruction.queryParams) {
                    mergeObjects(routeParams, instruction.queryParams);
                }

                // initialize module values
                routeParams.moduleName = getModuleName(instruction.config.moduleId);

                router.routeData(routeParams);
            } else {
                router.routeData(defaultRouteData);
            }
        });

        function mergeObjects(destinationObject, sourceObject) {
            for (var fieldName in sourceObject) {
                if (sourceObject.hasOwnProperty(fieldName) && _.isNullOrUndefined(destinationObject[fieldName])) {
                    destinationObject[fieldName] = sourceObject[fieldName];
                }
            }
        }

        function getModuleName(moduleIdValue) {
            return moduleIdValue && moduleIdValue.slice(moduleIdValue.lastIndexOf('/') + 1);
        };
        
        //
    }
    
    return {
        execute: execute
    };
})