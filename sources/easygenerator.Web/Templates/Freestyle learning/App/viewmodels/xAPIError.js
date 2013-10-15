define(['durandal/plugins/router', 'eventsManager'],
    function (router, eventsManager) {
        
        var
            navigateBackUrl = '',

            restartExperience = function () {
                router.replaceLocation("");
            },
            
            continueLearning = function () {
                eventsManager.removeAllListeners();

                router.navigateTo(navigateBackUrl);
            },

            activate = function (route) {
                navigateBackUrl = route.backUrl;
            };

        return {
            restartExperience: restartExperience,
            continueLearning: continueLearning,
            
            activate: activate
        };
    }
);