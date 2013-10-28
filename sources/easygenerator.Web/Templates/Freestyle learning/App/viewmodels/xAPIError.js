define(['plugins/router', 'xAPI/xAPIManager'],
    function (router, xAPIManager) {
        
        var
            navigateBackUrl = '',

            restartExperience = function () {
                var rootUrl = location.toString().replace(location.hash, '');
                router.navigate(rootUrl, { replace: true, trigger: true });
            },
            
            continueLearning = function () {
                xAPIManager.destroy();

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