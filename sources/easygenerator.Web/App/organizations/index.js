import shell from 'viewmodels/shell';
import isViewReady from 'routing/isViewReadyMixin';
import localizationManager from 'localization/localizationManager';

var childRouter = shell.router.createChildRouter()
    .makeRelative({
        fromParent: true
    }).map([
        {
            route: ':organizationId*details',
            moduleId: 'organizations/organization/organization',
            hash: '#organizations/:organizationId',
            title: localizationManager.localize('manageOrganization')
        }
    ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();

isViewReady.assign(childRouter);

export default {
    router: childRouter,
    activate: function() {}
};