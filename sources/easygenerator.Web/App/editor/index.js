import index from 'viewmodels/courses/course/index';
import localizationManager from 'localization/localizationManager';

export default index.router.createChildRouter()
    .makeRelative({
        fromParent: true,
        dynamicHash: ':courseId'
    }).map([
        { route: '', moduleId: 'editor/course/index', title: localizationManager.localize('courseCreateItem') },
        { route: 'objectives/:objectiveId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: localizationManager.localize('questionProperties') }
    ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();