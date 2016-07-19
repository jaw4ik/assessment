import router from 'plugins/router';
import uiLocker from 'uiLocker';
import httpRequestTracker from 'http/httpRequestTracker';

router.openUrl = function (url) {
    window.open(url, '_blank');
};

router.replace = function (url) {
    router.navigate(url, { replace: true, trigger: true });
};

router.reloadLocation = function () {
    document.location.reload(true);
};

router.setLocation = function (url) {
    document.location = url;
};

router.navigateWithQueryString = function (url) {
    var queryString = router.activeInstruction().queryString;
    router.navigate(_.isNullOrUndefined(queryString) ? url : url + '?' + queryString);
};

router.download = function (url) {
    var hash = window.location.hash,
        href = window.location.href;
    var downloadUrl = hash == '' ? href + '/' + url : href.replace(hash, url);
    window.open(downloadUrl);
};

router.setDefaultLocationHash = function (hash) {
    var locationHash = router.getLocationHash();
    if (hash && hash.hash && hash.hash.length && !locationHash.length) {
        locationHash = hash.hash;
    }
    if (locationHash == '#404') {
        locationHash = 'courses';
    }
    return router.setLocationHash(locationHash);
}

router.getLocationHash = function () {
    return window.location.hash;
};

router.setLocationHash = function (hash) {
    return window.location.hash = hash;
};

router.guardRoute = function (routeInfo) {
    if (router.isFirstVisitPage && routeInfo.__moduleId__ == "viewmodels/errors/404") {
        return 'courses';
    }

    if (!httpRequestTracker.isRequestPending()) {
        return true;
    }

    var defer = Q.defer();
    uiLocker.lock();
    httpRequestTracker.waitForRequestFinalization().then(() => {
        defer.resolve(true);
        uiLocker.unlock();
    });

    return defer.promise;
};

// add routeData to routing
var defaultRouteData = {
    courseId: null,
    moduleName: null
};

router.routeData = ko.observable(defaultRouteData);
router.isFirstVisitPage = true;

var compositionComplete = router.on('router:navigation:composition-complete').then(function () {
    router.isFirstVisitPage = false;
    compositionComplete.off();
});

router.activeInstruction.subscribe(function (instruction) {
    var url = instruction.fragment;
    var context = {
        moduleName: getModuleName(instruction.config.moduleId)
    };

    var parts = url.split('/');
    var i = 0, len = parts.length;
    for (; i < len; i++) {
        if (parts[i] === 'courses' && parts[i + 1]) {
            context.courseId = parts[i + 1];
            i++;
        }
        if (parts[i] === 'sections' && parts[i + 1]) {
            context.sectionId = parts[i + 1];
            i++;
        }
        if (parts[i] === 'questions' && parts[i + 1]) {
            context.questionId = parts[i + 1];
            i++;
        }
    }

    router.routeData(context);
});

function getModuleName(moduleIdValue) {
    return moduleIdValue && moduleIdValue.slice(moduleIdValue.lastIndexOf('/') + 1);
};

export default router;