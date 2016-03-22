define(['eventTracker',
        'viewmodels/learningPaths/index',
        'plugins/router',
        'routing/isViewReadyMixin',
        'viewmodels/common/titleField',
        'constants',
        'localization/localizationManager',
        'viewmodels/learningPaths/learningPath/commands/updateTitleCommand',
        'viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery',
        'clientContext',
        'dialogs/learningPath/shareLearningPath'
],
function (eventTracker, index, router, isViewReady, titleField, constants, localizationManager, updateTitleCommand, getLearningPathByIdQuery, clientContext, publishLearningPathDialog) {
    'use stict';

    var events = {
        updateTitle: 'Update learning path title',
        navigateToDetails: 'Navigate to learning path details',
        navigateToConfigure: 'Navigate to configure learning path',
        navigateToPublish: 'Navigate to publish learning path',
        navigateToResults: 'Navigate to learning path results',
        openShareDialog: 'Open \'share\' dialog'
    };

    var childRouter = index.router.createChildRouter()
        .makeRelative({
            fromParent: true,
            dynamicHash: ':learningPathId'
        }).map([
            {
                route: '',
                moduleId: 'viewmodels/learningPaths/learningPath/details',
                title: localizationManager.localize('courseCreateItem'),
                nav: 1,
                hash: '#learningPaths/:learningPathId',
                settings: {
                    localizationKey: 'course'
                },
                navigate: function () {
                    eventTracker.publish(events.navigateToDetails);
                    router.navigate(this.dynamicHash());
                }
            },
            {
                route: 'configure',
                moduleId: 'viewmodels/learningPaths/learningPath/configure/index',
                title: localizationManager.localize('courseConfigureItem'),
                nav: 2,
                hash: '#learningPaths/:learningPathId/configure',
                settings: {
                    localizationKey: 'course'
                },
                navigate: function () {
                    eventTracker.publish(events.navigateToConfigure);
                    router.navigate(this.dynamicHash());
                }
            },
            {
                route: 'publish',
                moduleId: 'viewmodels/learningPaths/learningPath/publish',
                title: localizationManager.localize('coursePublishItem'),
                nav: 3,
                hash: '#learningPaths/:learningPathId/publish',
                settings: {
                    localizationKey: 'course'
                },
                navigate: function () {
                    eventTracker.publish(events.navigateToPublish);
                    router.navigate(this.dynamicHash());
                }
            },
            {
                route: 'results',
                moduleId: 'viewmodels/learningPaths/learningPath/results',
                title: localizationManager.localize('courseResultsItem'),
                nav: 4,
                hash: '#learningPaths/:learningPathId/results',
                settings: {
                    localizationKey: 'course'
                },
                navigate: function () {
                    eventTracker.publish(events.navigateToResults);
                    router.navigate(this.dynamicHash());
                }
            }
        ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();

    isViewReady.assign(childRouter);

    var viewModel = {
        router: childRouter,

        id: null,
        learningPath: null,
        title: ko.observable(''),
        share: share,

        activate: activate,
        canActivate: canActivate
    };

    viewModel.titleField = titleField('', constants.validation.learningPathTitleMaxLength, localizationManager.localize('learningPathTitle'), getTitle, updateTitle);

    return viewModel;

    function share() {
        eventTracker.publish(events.openShareDialog);
        publishLearningPathDialog.show(viewModel.id);
    }

    function canActivate(learningPathId) {
        return getLearningPathByIdQuery.execute(learningPathId).then(function (learningPath) {
            if (_.isObject(learningPath)) {
                return true;
            }

            return { redirect: '404' };
        });
    }

    function activate(learningPathId) {
        viewModel.id = learningPathId;

        return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
            viewModel.titleField.title(learningPath.title);
            viewModel.titleField.isSelected(clientContext.get(constants.clientContextKeys.lastCreatedLearningPathId) === learningPath.id);
            clientContext.remove(constants.clientContextKeys.lastCreatedLearningPathId);
            viewModel.learningPath = learningPath;
        });
    }

    function getTitle() {
        return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
            return learningPath.title;
        });
    }

    function updateTitle(title) {
        eventTracker.publish(events.updateTitle);
        return updateTitleCommand.execute(viewModel.id, title);
    }

});