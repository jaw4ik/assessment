import shell from 'viewmodels/shell';
import isViewReady from 'routing/isViewReadyMixin';
import localizationManager from 'localization/localizationManager';


var childRouter = shell.router.createChildRouter()
   .makeRelative({
       fromParent: true,
   }).map([
       { route: '', moduleId: 'viewmodels/courses/courses', hash: '#courses', title: localizationManager.localize('courses') },
       { route: ':courseId*details', moduleId: 'viewmodels/courses/course/index', hash: '#courses/:courseId', title: localizationManager.localize('course') }
   ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();


isViewReady.assign(childRouter);



export default {
    router: childRouter,
    activate: function () {

    }
};
export var __useDefault = true;