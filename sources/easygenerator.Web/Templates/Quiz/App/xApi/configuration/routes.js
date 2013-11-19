define([], function () {

    return [
        {
            route: 'login',
            moduleId: 'xApi/viewmodels/login',
            title: 'Login',
            rootLinkDisabled: true
        },
        {
            route: 'xapierror(/:backUrl)',
            moduleId: 'xApi/viewmodels/xAPIError',
            title: 'xAPI Error',
            rootLinkDisabled: true
        }
    ];

});