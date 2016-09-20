import shell from 'viewmodels/shell';
import localizationManager from 'localization/localizationManager';

var childRouter = shell.router.createChildRouter()
    .makeRelative({
        fromParent: true
    }).map([
        {
            route: '',
            moduleId: 'examples/start',
            hash: '#start',
            title: 'Start'
        },{
            route: 'examples',
            moduleId: 'examples/courses/index',
            hash: '#start/examples',
            title: 'Examples'
        }
    ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();

export default {
router: childRouter,
    activate: function() {}
};