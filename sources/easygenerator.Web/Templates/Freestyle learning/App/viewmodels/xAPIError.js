define(['plugins/router', 'context', 'durandal/app', 'eventManager'],
    function (router, context, app, eventManager) {
        
        var
            navigateBackUrl = '',

            restartExperience = function () {
                eventManager.turnAllEventsOff();
                context.isTryAgain = true;
                context.isRestartExperience = true;
                var href = window.location.href,
                    url = href.slice(0,href.lastIndexOf('#'));
                router.replace(url);
            },
            
            continueLearning = function () {
                eventManager.turnAllEventsOff();
                router.navigate(navigateBackUrl);
            },

            activate = function (backUrl) {
                navigateBackUrl = backUrl;
            };

        return {
            restartExperience: restartExperience,
            continueLearning: continueLearning,
            
            activate: activate
        };
    }
);