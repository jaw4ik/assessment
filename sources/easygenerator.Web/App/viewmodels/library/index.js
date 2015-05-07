define(['viewmodels/shell', 'routing/isViewReadyMixin', 'localization/localizationManager', 'eventTracker'], function (shell, isViewReady, localizationManager, eventTracker) {

    "use strict";

    var events = {
        navigateToVideos: 'Navigate to videos',
        navigateToObjectives: 'Navigate to objectives'
    }

    var childRouter = shell.router.createChildRouter()
        .makeRelative({
            fromParent: true
        }).map([
            {
                route: ['', 'videos'],
                moduleId: 'viewmodels/videos/videos',
                title: localizationManager.localize('videoLibrary'),
                nav: true,
                hash: '#library/videos',
                navigate: function () {
                    eventTracker.publish(events.navigateToVideos);
                    childRouter.navigate(this.hash);
                }
            },
            {
                route: 'objectives*details',
                moduleId: 'viewmodels/objectives/index',
                title: localizationManager.localize('learningObjectives'),
                nav: true,
                hash: '#library/objectives',
                navigate: function () {
                    eventTracker.publish(events.navigateToObjectives);
                    childRouter.navigate(this.hash);
                }
            }
        ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();

    isViewReady.assign(childRouter);
    
    return {
        router: childRouter,
        activate: function () {

        }
    };

});