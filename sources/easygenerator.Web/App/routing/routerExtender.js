define(['durandal/app', 'plugins/router', 'localization/localizationManager'], function (app, router, localizationManager) {

    return {
        execute: execute
    };

    function execute() {

        router.openUrl = function (url) {
            window.open(url, '_blank');
        };

        router.updateDocumentTitle = function (instance, instruction) {
            var title = null;

            if (instruction.config.settings && instruction.config.settings.localizationKey) {
                title = localizationManager.localize(instruction.config.settings.localizationKey);

            } else if (instruction.config.title) {
                title = instruction.config.title;
            }

            document.title = title ? app.title + ' | ' + title : app.title;
        };

        router.replace = function (url) {
            router.navigate(url, { replace: true, trigger: true });
        };

        router.reloadLocation = function () {
            document.location.reload();
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
    }

})