﻿define(['plugins/router', 'context', 'durandal/app', 'events'],
    function (router, context, app, events) {
        
        var
            navigateBackUrl = '',

            restartExperience = function () {
                context.isTryAgain = true;
                router.replace('home');
            },
            
            continueLearning = function () {
                _.each(events, function (event) {
                    app.off(event);
                });
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