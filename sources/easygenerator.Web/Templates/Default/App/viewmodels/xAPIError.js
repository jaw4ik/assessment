define(['durandal/plugins/router', 'eventTracker'],
    function (router, eventTracker) {
        
        var
            navigateBackUrl = '',

            restartExperience = function () {
                router.replaceLocation("#/");
            },
            
            continueLearning = function () {
                eventTracker.removeAllListeners();

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