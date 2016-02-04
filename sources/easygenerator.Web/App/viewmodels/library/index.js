define(['viewmodels/shell', 'routing/isViewReadyMixin', 'localization/localizationManager', 'eventTracker', 'durandal/app', 'constants'],
    function (shell, isViewReady, localizationManager, eventTracker, app, constants) {
        "use strict";

        var events = {
            navigateToVideos: 'Navigate to videos',
            navigateToAudios: 'Navigate to audios',
            navigateToImages: 'Navigate to images',
            navigateToObjectives: 'Navigate to objectives'
        }

        var childRouter = shell.router.createChildRouter()
            .makeRelative({
                fromParent: true
            }).map([
                {
                    route: ['', 'images'],
                    moduleId: 'images/index',
                    title: localizationManager.localize('imageLibrary'),
                    nav: true,
                    hash: '#library/images',
                    navigate: function () {
                        eventTracker.publish(events.navigateToImages);
                        childRouter.navigate(this.hash);
                    }
                },
                {
                    route: ['audios'],
                    moduleId: 'viewmodels/audios/audios',
                    title: localizationManager.localize('audioLibrary'),
                    nav: true,
                    hash: '#library/audios',
                    navigate: function () {
                        eventTracker.publish(events.navigateToAudios);
                        childRouter.navigate(this.hash);
                    }
                },
                {
                    route: ['videos'],
                    moduleId: 'viewmodels/videos/videos',
                    title: localizationManager.localize('videoLibrary'),
                    nav: true,
                    hash: '#library/videos',
                    navigate: function () {
                        eventTracker.publish(events.navigateToVideos);
                        childRouter.navigate(this.hash);
                    }
                }
            ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();

        isViewReady.assign(childRouter);

        return {
            router: childRouter,
            activate: function () {
                if (childRouter.parent.activeInstruction().fragment == 'library') {
                    app.trigger(constants.messages.library.defaultActivate);
                }

            }
        };

    });