define(['durandal/plugins/router', 'eventTracker'],
    function (router, eventTracker) {
        
        var
            restartExperience = function () {
                var url = window.location.toString();
                url = url.substring(0, url.indexOf("#/"));

                router.replaceLocation(url);
            },
            
            continueLearning = function () {
                eventTracker.removeAllListeners();

                router.navigateBack();
            },

            activate = function () {
            };

        return {
            restartExperience: restartExperience,
            continueLearning: continueLearning,
            
            activate: activate
        };
    }
);