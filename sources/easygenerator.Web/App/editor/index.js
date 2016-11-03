import index from 'viewmodels/courses/course/index';
import localizationManager from 'localization/localizationManager';

export default index.router.createChildRouter()
    .makeRelative({
        fromParent: true,
        dynamicHash: ':courseId'
    }).map([
        { route: ['', 'sections/:sectionId'], moduleId: 'editor/course/index', title: localizationManager.localize('courseCreateItem') },
        { route: ['', 'sections/:sectionId/questions/:questionId'], moduleId: 'editor/course/index', title: localizationManager.localize('courseCreateItem') }
    ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();