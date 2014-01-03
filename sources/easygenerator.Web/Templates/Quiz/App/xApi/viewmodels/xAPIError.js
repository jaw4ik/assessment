define(['plugins/router', 'eventManager'],
    function (router, eventManager) {
        
        var
            navigateBackUrl = '',

            restartCourse = function () {
                var rootUrl = location.toString().replace(location.hash, '');
                router.navigate(rootUrl, { replace: true, trigger: true });
            },
            
            continueLearning = function () {
                eventManager.turnAllEventsOff();

                router.navigate(navigateBackUrl);
            },

            activate = function (backUrl) {
                navigateBackUrl = backUrl;
            };

        return {
            restartCourse: restartCourse,
            continueLearning: continueLearning,
            
            activate: activate
        };
    }
);