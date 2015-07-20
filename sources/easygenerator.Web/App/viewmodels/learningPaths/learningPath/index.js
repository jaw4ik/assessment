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
        'viewmodels/learningPaths/learningPath/actions/download'],
function (eventTracker, index, router, isViewReady, titleField, constants, localizationManager, updateTitleCommand, getLearningPathByIdQuery, clientContext, downloadAction) {
    'use stict';

    var events = {
        updateTitle: 'Update learning path title',
        navigateToDetails: 'Navigate to learning path details',
        navigateToPublish: 'Navigate to publish learning path'
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
                route: 'publish',
                moduleId: 'viewmodels/learningPaths/learningPath/publish',
                title: localizationManager.localize('coursePublishItem'),
                nav: 2,
                hash: '#learningPaths/:learningPathId/publish',
                settings: {
                    localizationKey: 'course'
                },
                navigate: function () {
                    eventTracker.publish(events.navigateToPublish);
                    router.navigate(this.dynamicHash());
                }
            }
        ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();

    isViewReady.assign(childRouter);

    var viewModel = {
        router: childRouter,

        id: null,
        title: ko.observable(''),
        downloadAction: downloadAction(),
        activate: activate,
        canActivate: canActivate
    };

    viewModel.titleField = titleField('', constants.validation.learningPathTitleMaxLength, localizationManager.localize('learningPathTitle'), getTitle, updateTitle);

    return viewModel;

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
            viewModel.downloadAction.activate(learningPath);
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